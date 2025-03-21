import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IPage } from '../types/Page';
import { settings } from '../utils/constants';

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _store: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._counter = ensureElement<HTMLElement>(settings.page.basketCounter);
    this._store = ensureElement<HTMLElement>(settings.page.gallery);
    this._wrapper = ensureElement<HTMLElement>(settings.page.wrapper);
    this._basket = ensureElement<HTMLElement>(settings.page.basket);

    this._basket.addEventListener('click', () => {
      this.events.emit(settings.events.basket.open);
    });
  }

  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  set store(items: HTMLElement[]) {
    this._store.replaceChildren(...items);
  }

  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add(settings.page.lockScroll);
    } else {
      this._wrapper.classList.remove(settings.page.lockScroll);
    }
  }
}
