import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, fromEvent, takeUntil, tap } from 'rxjs';
import { CustomDragDropService } from '../custom-drag-drop.service';
import { DragDropConfig, DragDropItem } from '../drag-drop-model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements OnInit, OnDestroy {
  @Input('id') public id!: string;
  @Input('data') public data!: DragDropItem;
  @Input('config') public config!: DragDropConfig;
  @ViewChild('ref', { static: true }) public ref!: ElementRef<HTMLDivElement>;
  @Input('canvasWrapper') public canvasWrapper!: ElementRef<HTMLElement>;
  private _unsubscribe$ = new Subject<void>();
  private _unsubscribeAll$ = new Subject<void>();

  constructor(private _service: CustomDragDropService) {}

  ngOnInit(): void {
    const element = this.ref.nativeElement;
    this.canvasWrapper.nativeElement.appendChild(element);
    element.style.pointerEvents = 'auto';
    element.style.width = this.data.width * this.config.zoom + 'px';
    element.style.height = this.data.height * this.config.zoom + 'px';

    if (this.data.positionX < 0) {
      element.style.left = '0px';
    } else if (
      this.data.positionX * this.config.zoom + element.offsetWidth >
      this.canvasWrapper.nativeElement.offsetWidth
    ) {
      element.style.left =
        this.canvasWrapper.nativeElement.offsetWidth -
        element.offsetWidth +
        'px';
    } else element.style.left = this.data.positionX * this.config.zoom + 'px';

    if (this.data.positionY < 0) {
      element.style.top = '0px';
    } else if (
      this.data.positionY * this.config.zoom + element.offsetHeight >
      this.canvasWrapper.nativeElement.offsetHeight
    ) {
      element.style.top =
        this.canvasWrapper.nativeElement.offsetHeight -
        element.offsetHeight +
        'px';
    } else element.style.top = this.data.positionY * this.config.zoom + 'px';

    element.style.fontSize =
      (this.data.fontSize! || this.config.defaultFontSize) * this.config.zoom +
      'px';
    this.data.positionX = Math.round(element.offsetLeft / this.config.zoom);
    this.data.positionY = Math.round(element.offsetTop / this.config.zoom);

    // const canvas = this.canvasWrapper.nativeElement
    //   .firstChild as HTMLCanvasElement;
    // this.data.pageHeight = canvas.offsetHeight / this.config.zoom;
    // this.data.pageWidth = canvas.offsetWidth / this.config.zoom;
  }

  remove() {
    this._service.removeItem(this.id);
  }

  resize(event: MouseEvent) {
    let element = this.ref.nativeElement;
    const canvasWrapper = element.parentElement!;
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = element.offsetWidth;
    const startHeight = element.offsetHeight;
    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        takeUntil(this._unsubscribeAll$),
        takeUntil(
          fromEvent<MouseEvent>(document, 'mouseup').pipe(
            tap(() => {
              this._service.resizeItem(false);
              if (
                element.offsetTop + element.offsetHeight >
                canvasWrapper.offsetHeight
              )
                element.style.top =
                  canvasWrapper.offsetHeight - element.offsetHeight + 'px';
              if (
                element.offsetLeft + element.offsetWidth >
                canvasWrapper.offsetWidth
              )
                element.style.left =
                  canvasWrapper.offsetWidth - element.offsetWidth + 'px';
              this.updateData();
            })
          )
        )
      )
      .subscribe((event) => {
        this._service.resizeItem(true);
        const newWidth = startWidth + event.clientX - startX;
        const newHeight = startHeight + event.clientY - startY;

        if (
          newWidth >= this.config.minWidth &&
          newWidth <= this.config.maxWidth
        )
          element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';

        if (newWidth < this.config.minWidth)
          element.style.width = this.config.minWidth + 'px';
        else if (newWidth > this.config.maxWidth)
          element.style.width = this.config.maxWidth + 'px';

        if (newHeight < this.config.minHeight)
          element.style.height = this.config.minHeight + 'px';
        else if (newHeight > this.config.maxHeight)
          element.style.height = this.config.maxHeight + 'px';

        const ratio =
          (element.clientWidth * element.clientHeight) /
          (this.config.defaultWidth * this.config.defaultHeight);

        if (ratio > 1)
          element.style.fontSize =
            this.config.defaultFontSize * (0.8 + 0.2 * ratio) + 'px';
        else
          element.style.fontSize =
            this.config.defaultFontSize * (0.15 + 0.85 * ratio) + 'px';
        this.updateData();
      });
  }

  move(event: MouseEvent) {
    let element = this.ref.nativeElement;
    let canvasWrapper = element.parentElement!;
    let page = canvasWrapper.parentElement;
    const shiftX = event.clientX - element.getBoundingClientRect().left;
    const shiftY = event.clientY - element.getBoundingClientRect().top;

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        takeUntil(this._unsubscribeAll$),
        takeUntil(
          fromEvent<MouseEvent>(document, 'mouseup').pipe(
            tap(() => {
              this._service.moveItem(false);
              if (
                element.offsetTop + element.offsetHeight >
                canvasWrapper.offsetHeight
              )
                element.style.top =
                  canvasWrapper.offsetHeight - element.offsetHeight + 'px';
              else if (element.offsetTop < 0) element.style.top = '0px';
              this.updateData();
            })
          )
        )
      )
      .subscribe((ev) => {
        this._service.moveItem(true);
        let left =
          ev.pageX - shiftX - canvasWrapper.getBoundingClientRect().left;
        const top =
          ev.pageY - shiftY - canvasWrapper.getBoundingClientRect().top;

        if (left < 0) left = 0;
        else if (left > canvasWrapper.clientWidth - element.offsetWidth)
          left = canvasWrapper.clientWidth - element.offsetWidth;
        element.style.left = left + 'px';
        const nextPage = page?.nextElementSibling as HTMLElement;
        const previousPage = page?.previousElementSibling as HTMLElement;
        if (top < 0 && previousPage) {
          page = previousPage;
          canvasWrapper = page.firstChild as HTMLElement;
          canvasWrapper.appendChild(element);
          element.style.top = canvasWrapper.offsetHeight - top + 10 + 'px';
        } else if (top >= canvasWrapper.offsetHeight + 10 && nextPage) {
          page = nextPage;
          canvasWrapper = page.firstChild as HTMLElement;
          canvasWrapper.appendChild(element);
          element.style.top = '0px';
        } else element.style.top = top + 'px';

        this.updateData();
      });
  }

  updateData() {
    const element = this.ref.nativeElement;
    this.data.positionX = element.offsetLeft;
    this.data.positionY = element.offsetTop;
    this.data.width = element.clientWidth;
    this.data.height = element.clientHeight;
    this.data.fontSize = parseFloat(element.style.fontSize.split('px')[0]);
    this.data.page = parseInt(
      element.parentElement?.parentElement!.getAttribute('data-page-number')!
    );
    // const canvas = this.canvasWrapper.nativeElement
    //   .firstChild as HTMLCanvasElement;
    // this.data.pageHeight = canvas.offsetHeight / this.config.zoom;
    // this.data.pageWidth = canvas.offsetWidth / this.config.zoom;
  }

  ngOnDestroy(): void {
    this.ref.nativeElement.remove();
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }
}
