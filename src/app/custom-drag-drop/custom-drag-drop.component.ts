import {
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer';
import {
  Subject,
  combineLatest,
  fromEvent,
  map,
  skip,
  startWith,
  takeUntil,
} from 'rxjs';
import { CustomDragDropService } from './custom-drag-drop.service';
import { DragDropConfig, DragDropItem } from './drag-drop-model';
import { GeneratorComponent } from './generator/generator.component';
import { ItemComponent } from './item/item.component';

@Component({
  selector: 'app-custom-drag-drop',
  templateUrl: './custom-drag-drop.component.html',
  styleUrls: ['./custom-drag-drop.component.css'],
})
export class CustomDragDropComponent implements OnInit, OnDestroy, OnChanges {
  @Input('pdf') public pdf!: NgxExtendedPdfViewerComponent;
  @Input('data') public data!: DragDropItem[];
  @Input('config') public config!: DragDropConfig;
  @Output('onDataChange') public onDataChange = new EventEmitter<void>();
  @ViewChild('container', { read: ViewContainerRef, static: true })
  private _container!: ViewContainerRef;
  @ViewChild('generator', { read: ViewContainerRef, static: true })
  private _generator!: ViewContainerRef;
  private _listItem = new Array<ComponentRef<ItemComponent>>();
  private _unsubscribeAll$ = new Subject<void>();
  private _dataCopy: DragDropItem[] = [];

  constructor(private _service: CustomDragDropService) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    this._dataCopy = changes['data'].currentValue;
  }

  ngOnInit(): void {
    this._dataCopy = this.data;
    this._service.removeItemEvent
      .pipe(takeUntil(this._unsubscribeAll$))
      .subscribe((val) => {
        const index = this._listItem.findIndex(
          (item) => item.instance.id == val
        );
        if (index != -1) {
          this._listItem.splice(index, 1);
          this._container.remove(index);
          this.onDataChange.emit();
        }
      });

    combineLatest([
      this._service.moveItemEvent.pipe(startWith(false)),
      this._service.resizeItemEvent.pipe(startWith(false)),
    ])
      .pipe(takeUntil(this._unsubscribeAll$), skip(1))
      .subscribe((event) => {
        this.pdf.handTool = !(event[0] || event[1]);
        this.onDataChange.emit();
      });

    this.pdf.zoomChange
      .pipe(takeUntil(this._unsubscribeAll$))
      .subscribe((val) => {
        this._listItem = [];
        this._container.clear();
        this.config.zoom = (val as number) / 100;
      });

    fromEvent<MouseEvent>(document, 'wheel')
      .pipe(takeUntil(this._unsubscribeAll$))
      .subscribe((event) => {
        if (event.ctrlKey) {
          this._listItem = [];
          this._container.clear();
        }
      });

    this.pdf.pdfLoaded
      .pipe(map((val) => val.pagesCount))
      .subscribe((pagesCount) => {
        this._listItem = [];
        this._container.clear();
        if (pagesCount > 0) {
          this.pdf.pageRendered
            .pipe(takeUntil(this.pdf.pdfLoaded))
            .subscribe((event) => {
              for (const item of this._dataCopy) {
                if (event.pageNumber == item.page) {
                  const component =
                    this._container.createComponent(ItemComponent);
                  const instance = component.instance;
                  instance.id = item.id;
                  instance.data = item;
                  instance.config = this.config;
                  instance.canvasWrapper = new ElementRef<HTMLElement>(
                    event.source.canvas.parentElement
                  );
                  this._listItem.push(component);
                }
              }
            });
        }
      });
  }

  addItem(event: MouseEvent) {
    const generatorComponent =
      this._generator.createComponent(GeneratorComponent);
    const generatorInstance = generatorComponent.instance;
    generatorInstance.config = this.config;
    generatorInstance.clientX = event.clientX;
    generatorInstance.clientY = event.clientY;
    generatorInstance.onDrop.subscribe((event) => {
      if (event.canvas.tagName == 'CANVAS') {
        const component = this._container.createComponent(ItemComponent);
        const instance = component.instance;
        instance.config = this.config;
        instance.canvasWrapper = new ElementRef<HTMLElement>(
          event.canvas.parentElement as HTMLElement
        );
        console.log(window.devicePixelRatio);

        instance.data = {
          id: crypto.randomUUID(),
          positionX: event.x,
          positionY: event.y,
          width: this.config.defaultWidth,
          height: this.config.defaultHeight,
          fontSize: this.config.defaultFontSize,
          page: parseInt(
            event.canvas.parentElement?.parentElement!.getAttribute(
              'data-page-number'
            )!
          ),
          pageHeight: event.canvas.height / window.devicePixelRatio,
          pageWidth: event.canvas.width / window.devicePixelRatio,
        };
        this._listItem.push(component);
        this._dataCopy.push(instance.data);
        component.changeDetectorRef.detectChanges();
        this.onDataChange.emit();
      }
      generatorComponent.destroy();
    });
  }

  get listItem(): DragDropItem[] {
    return this._listItem.map((item) => item.instance.data);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }
}
