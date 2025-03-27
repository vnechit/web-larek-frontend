import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { TUserOrder } from "../../types";
import { Form } from "./formComponent";

interface IOrder {
    isValid: boolean;
}

export class Order extends Form<IOrder>{
    protected cashButton: HTMLButtonElement;
    protected cardButton: HTMLButtonElement;
    protected input: HTMLInputElement;
    private data: TUserOrder = {
        payment: '',
        address: ''
    };

    constructor (protected container: HTMLElement, events: IEvents) {
        super(container, events, settings.basket.order);
                
        this.cardButton = ensureElement<HTMLButtonElement>("[name=card]", this.container);
        this.cashButton = ensureElement<HTMLButtonElement>("[name=cash]", this.container);
        this.input = ensureElement<HTMLInputElement>("[name=address]", this.container);

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();            
            this.events.emit(settings.events.order.submit, {payment: this.data.payment, address: this.data.address});
        });
        
        this.cashButton.addEventListener('click', () => {
            this.cashButton.classList.add(settings.page.activeButton);
            this.cardButton.classList.remove(settings.page.activeButton);
            this.data.payment = 'cash';
            this.validateForm();
        });
        this.cardButton.addEventListener('click', () => {
            this.cardButton.classList.add(settings.page.activeButton);
            this.cashButton.classList.remove(settings.page.activeButton);
            this.data.payment = 'card';
            this.validateForm();
        });
        this.input.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const value = target.value;
            this.data.address = value; 
            this.validateForm();
        });
    }

    validateForm () {
        if (!this.data.payment.length) {
            this.error.textContent = 'Выберите способ оплаты';
            this.isValid = false;
            return;
        }
        if (!this.data.address.length) {
            this.error.textContent = 'Введите адрес';
            this.isValid = false;
            return;
        }
        this.isValid = true;
        this.error.textContent = '';
    }
}