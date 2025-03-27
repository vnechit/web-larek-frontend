import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { TUserContacts } from "../../types";
import { Form } from "./formComponent";

interface IContacts {
    isValid: boolean;
}

export class Contacts extends Form<IContacts>{
    protected inputEmail: HTMLInputElement;
    protected inputPhone: HTMLInputElement;
    private data: TUserContacts = {
        email: '',
        phone: ''
    };

    constructor (protected container: HTMLElement, events: IEvents) {
        super(container, events, '.button');
                
        this.inputEmail = ensureElement<HTMLInputElement>("[name=email]", this.container);
        this.inputPhone = ensureElement<HTMLInputElement>("[name=phone]", this.container);

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