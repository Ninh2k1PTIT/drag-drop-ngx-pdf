import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, fromEvent, skip, takeUntil } from 'rxjs';
import { DragDropConfig } from '../drag-drop-model';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
})
export class GeneratorComponent implements OnInit, OnDestroy {
  @ViewChild('target', { static: true })
  public target!: ElementRef<HTMLDivElement>;
  @Input('config') public config!: DragDropConfig;
  @Input('clientX') public clientX!: number;
  @Input('clientY') public clientY!: number;
  @Output('onDrop') public onDrop = new EventEmitter<{
    x: number;
    y: number;
    canvas: HTMLCanvasElement;
  }>();
  private _unsubscribeAll$ = new Subject<void>();
  constructor() {}

  ngOnInit(): void {
    const element = this.target.nativeElement;
    element.style.width = this.config.defaultWidth * this.config.zoom + 'px';
    element.style.height = this.config.defaultHeight * this.config.zoom + 'px';
    element.style.top = this.clientY - element.offsetHeight / 2 + 'px';
    element.style.left = this.clientX - element.offsetWidth / 2 + 'px';

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(takeUntil(this._unsubscribeAll$))
      .subscribe((event) => {
        element.style.top = event.clientY - element.offsetHeight / 2 + 'px';
        element.style.left = event.clientX - element.offsetWidth / 2 + 'px';
      });

    fromEvent<MouseEvent>(document, 'click')
      .pipe(skip(1), takeUntil(this._unsubscribeAll$))
      .subscribe((event) => {
        const target = event.target as HTMLCanvasElement;
        this.onDrop.emit({
          x:
            (element.offsetLeft - target.getBoundingClientRect().left) /
            this.config.zoom,
          y:
            (element.offsetTop - target.getBoundingClientRect().top) /
            this.config.zoom,
          canvas: target,
        });
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }
}
