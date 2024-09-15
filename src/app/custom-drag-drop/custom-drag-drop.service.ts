import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomDragDropService {
  private _removeItem$!: Subject<string>;
  private _moveItem$!: Subject<boolean>;
  private _resizeItem$!: Subject<boolean>;

  get removeItemEvent() {
    return this._removeItem$.asObservable();
  }

  get moveItemEvent() {
    return this._moveItem$.asObservable();
  }

  get resizeItemEvent() {
    return this._resizeItem$.asObservable();
  }

  constructor() {
    this._removeItem$ = new Subject();
    this._moveItem$ = new Subject();
    this._resizeItem$ = new Subject();
  }

  removeItem(id: string) {
    this._removeItem$.next(id);
  }

  moveItem(isMove: boolean) {
    this._moveItem$.next(isMove);
  }

  resizeItem(isResize: boolean) {
    this._resizeItem$.next(isResize);
  }
}
