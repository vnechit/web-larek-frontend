import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./component";
import { TUserContacts } from "../../types";

interface IContacts {
    isValid: boolean;
}

export class Contacts extends Component<IContacts>{
    protected events: IEvents;
    protected _isValid: boolean;
    protected button: HTMLButtonElement;
    protected inputEmail: HTMLInputElement;
    protected inputPhone: HTMLInputElement;
    protected error: HTMLElement;
    private data: TUserContacts = {
        email: '',
        phone: ''
    };

    constructor (protected container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
                
        this.button = ensureElement<HTMLButtonElement>('.button', this.container);        
        this.inputEmail = this.container.querySelector("[name=email]");
        this.inputPhone = this.container.querySelector("[name=phone]");
        this.error = ensureElement<HTMLElement>(settings.page.form.error, this.container);

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();            
            this.events.emit(settings.events.contacts.submit, {email: this.data.email, phone: this.data.phone});
        });
        this.inputEmail.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const value = target.value;
            this.data.email = value; 
            this.validateForm();
        });

        this.inputPhone.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const value = target.value;
            this.data.phone = value; 
            this.validateForm();
        });
    }

    set isValid (value: boolean) {
        this._isValid = value;
        this.button.disabled = !value;
    }

    validateForm () {
        if (!this.data.email.length) {
            this.error.textContent = 'Введите email';
            this.isValid = false;
            return;
        }
        if (!this.data.phone.length) {
            this.error.textContent = 'Введите телефон';
            this.isValid = false;
            return;
        }
        this.isValid = true;
        this.error.textContent = '';
    }
}