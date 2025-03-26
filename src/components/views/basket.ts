import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./component";


interface IBasketList {
    list: HTMLElement[];
    total: HTMLElement;
}

export class Basket extends Component<IBasketList> {
    protected _list: HTMLElement;
    protected button: HTMLButtonElement;
    protected _total: HTMLElement;
    protected _listparent: HTMLElement;
    protected events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        
        this.events = events;

        this.button = ensureElement<HTMLButtonElement>(settings.basket.button, this.container);
        this._total = ensureElement<HTMLElement>(settings.basket.price, this.container);
        this._list = ensureElement<HTMLElement>(settings.basket.list, this.container);
        this._listparent = ensureElement<HTMLElement>(settings.basket.list, this.container);

        this.button.addEventListener('click', () => {
            this.events.emit(settings.events.basket.order);
        });
    }

    set list (items: HTMLElement[]) {        
        this._list.replaceChildren(...items);
        this.button.disabled = items.length ? false : true;
    }

    set total (value: number) {        
        this._total.textContent = String(value) + ' синапсов';
    }    

    render (data?: Partial<IBasketList>, total?: number): HTMLElement {
        this.total = total;
        return super.render(data)
    }
}