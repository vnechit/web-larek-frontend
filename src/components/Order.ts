import { IEvents } from './base/events';
import { Form } from './common/Form';
import { IOrderDetails } from '../types/Order';
import { settings } from '../utils/constants';

export class Order extends Form<IOrderDetails> {
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container, events);

    this._card = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

    if (this._cash) {
      this._cash.addEventListener('click', () => {
        this._cash.classList.add(settings.page.activeButton)
        this._card.classList.remove(settings.page.activeButton)
        this.onInputChange('payment', 'cash')
      })
    }
    if (this._card) {
      this._card.addEventListener('click', () => {
        this._card.classList.add(settings.page.activeButton)
        this._cash.classList.remove(settings.page.activeButton)
        this.onInputChange('payment', 'card')
      })
    }
  }

  disableButtons() {
    this._cash.classList.remove(settings.page.activeButton)
    this._card.classList.remove(settings.page.activeButton)
  }
}
