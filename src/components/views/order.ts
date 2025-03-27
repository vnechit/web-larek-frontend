import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./component";
import { TUserOrder } from "../../types";

interface IOrder {
    isValid: boolean;
}

export class Order extends Component<IOrder>{
    protected events: IEvents;
    protected _isValid: boolean;
    protected button: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected cardButton: HTMLButtonElement;
    protected input: HTMLInputElement;
    protected error: HTMLElement;
    private data: TUserOrder = {
        payment: 'cash',
        address: ''
    };

    constructor (protected container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
                
        this.button = ensureElement<HTMLButtonElement>(settings.basket.order, this.container);
        this.cardButton = this.container.querySelector("[name=card]");
        this.cashButton = this.container.querySelector("[name=cash]");
        this.input = this.container.querySelector("[name=address]");
        this.error = ensureElement<HTMLElement>(settings.page.form.error, this.container);

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();            
            this.events.emit(settings.events.order.submit, {payment: this.data.payment, address: this.data.address});
        });
        
        this.cashButton.addEventListener('click', () => {
            this.cashButton.classList.add(settings.page.activeButton);
            this.cardButton.classList.remove(settings.page.activeButton);
            this.data.payment = 'cash';
            if (!this.data.address.length) {
                this.error.textContent = 'Введите адрес';
            }
        });
        this.cardButton.addEventListener('click', () => {
            this.cardButton.classList.add(settings.page.activeButton);
            this.cashButton.classList.remove(settings.page.activeButton);
            this.data.payment = 'card';
            if (!this.data.address.length) {
                this.error.textContent = 'Введите адрес';
            }
        });
        this.input.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const value = target.value;
            this.data.address = value; 
            if (value.length) {
                this.isValid = true;
                this.error.textContent = '';
            } else {
                this.error.textContent = 'Введите адрес';
                this.isValid = false;
            }
        });
    }

    set isValid (value: boolean) {
        this._isValid = value;
        this.button.disabled = !value;
    }
}