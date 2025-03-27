import { CDN_URL } from './../../utils/constants';
import { IProduct } from "../../types";
import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from './component';


class Card extends Component<IProduct> {
  protected events: IEvents;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _id: string;

  constructor (protected container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;
    
    this._title = ensureElement<HTMLElement>(settings.card.title, this.container);
    this._price = ensureElement<HTMLElement>(settings.card.price, this.container);
  }

  get id (): string {
    return this._id;
  }

  set id (value: string) {        
    this._id = value;
  }

  set price (value: number) {
    this._price.textContent = String(value) + ' синапсов';
  }

  set title (value: string) {
    this._title.textContent = value;
  }
};

export class CardStore extends Card {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(protected container: HTMLElement, events: IEvents) {
    super(container, events);

    this._category = ensureElement<HTMLElement>(settings.card.category, this.container);
    this._image = ensureElement<HTMLImageElement>(settings.card.image, this.container);
    this.container.addEventListener('click', ()=>{
      this.events.emit(settings.events.card.select, {id: this._id});
    });
  }

  set category (value: string) {
    this._category.textContent = value;
    this._category.classList.add(this.setCardCategory(value));
  }

  set image (value: string) {
    this._image.src = CDN_URL + value;
  }

  private setCardCategory (value: string) : string {
    let toReturn : string;
    switch (value) {
      case 'другое': {
        toReturn = 'card__category_other';
        break;
      }
      case 'софт-скил': {
        toReturn = 'card__category_soft';
        break;
      }
      case 'дополнительное': {
        toReturn = 'card__category_additional';
        break;
      }
      case 'кнопка': {
        toReturn = 'card__category_button';
        break;
      }
      default: {
        toReturn = 'card__category_hard';
        break;
      }
    }
    return toReturn;
  }
};

export class CardPreview extends CardStore {
  protected _description: HTMLElement;
  protected button: HTMLButtonElement;
  protected _isSelected: boolean;

  constructor (protected container: HTMLElement, events: IEvents) {
    super(container, events);

    this._description = ensureElement<HTMLElement>(settings.card.description, this.container);
    this.button = ensureElement<HTMLButtonElement>(settings.card.button, this.container);
      
    this.button.addEventListener('click', ()=>{
      this.isSelected = true;
      this.events.emit(settings.events.card.toBasket, {id: this._id});
    });
  }

  set description (value: string) {    
    this._description.textContent = value;
  }

  set isSelected (value: boolean) {  
      this._isSelected = value;    
      this.button.disabled = this._isSelected;
  }
};

export class CardBasket extends Card {
  protected _basketIndex: HTMLElement;
  protected button: HTMLButtonElement;

  constructor (protected container: HTMLElement, events: IEvents) {
    super(container, events);

    this._basketIndex = ensureElement<HTMLElement>(settings.basket.basketItemIndex, this.container);
    this.button = ensureElement<HTMLButtonElement>(settings.card.buttonBasket, this.container);
    this.button.addEventListener('click', () => {
      this.events.emit(settings.events.basket.delete, {id: this._id});
    });
  }

  set basketIndex (value: number) {
    this._basketIndex.textContent = String(value);
  }

  render (data: Partial<IProduct>, basketIndex?: number): HTMLElement {
    this.basketIndex = basketIndex;
    return super.render(data);
}
};