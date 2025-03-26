import { CDN_URL } from './../../utils/constants';
import { IProduct } from "../../types";
import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from './component';


export class Card extends Component<IProduct> {
  protected events: IEvents;
  protected _category?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _description?: HTMLElement;
  protected button?: HTMLButtonElement;
  protected _id: string;
  protected _isSelected: boolean;

  constructor (protected container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;
    
    this._title = ensureElement<HTMLElement>(settings.card.title, this.container);
    this._price = ensureElement<HTMLElement>(settings.card.price, this.container);
        
    if (container.classList.contains('gallery__item')) {
      this._category = ensureElement<HTMLElement>(settings.card.category, this.container);
      this._image = ensureElement<HTMLImageElement>(settings.card.image, this.container);
      this.container.addEventListener('click', ()=>{
        this.events.emit(settings.events.card.select, {id: this._id});
      });
    } else if (container.classList.contains('card_full')) {      
      this._category = ensureElement<HTMLElement>(settings.card.category, this.container);
      this._image = ensureElement<HTMLImageElement>(settings.card.image, this.container);
      this._description = ensureElement<HTMLElement>(settings.card.description, this.container);
      this.button = ensureElement<HTMLButtonElement>(settings.card.button, this.container);
      
      this.button.addEventListener('click', ()=>{
        this.isSelected = true;
        this.events.emit(settings.events.card.toBasket, {id: this._id});
      });
    } else {      
      this.button = ensureElement<HTMLButtonElement>(settings.card.buttonBasket, this.container);
      this.button.addEventListener('click', () => {
        this.events.emit(settings.events.basket.delete, {id: this._id});
      });
    }
  }

  get id (): string {
    return this._id;
  }

  set id (value: string) {        
    this._id = value;
  }

  set category (value: string) {
    if (this._category) {
      this._category.textContent = value;
      this._category.classList.add(this.setCardCategory(value));
    }
  }

  set image (value: string) {
    if (this._image) this._image.src = CDN_URL + value;
  }

  set price (value: number) {
    this._price.textContent = String(value) + ' синапсов';
  }

  set title (value: string) {
    this._title.textContent = value;
  }

  set description (value: string) {    
    if (this._description) this._description.textContent = value;
  }

  set isSelected (value: boolean) {  
    if (!this.container.classList.contains('basket__item')) {
      this._isSelected = value;    
      this.button.disabled = this._isSelected;
    }
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