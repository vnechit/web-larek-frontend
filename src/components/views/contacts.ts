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

    constructor (protected container: HTMLElement, events: IEvents) {
        super(container, events, '.button');
                
        this.inputEmail = ensureElement<HTMLInputElement>("[name=email]", this.container);
        this.inputPhone = ensureElement<HTMLInputElement>("[name=phone]", this.container);

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();            
            this.events.emit(settings.events.contacts.submit, {});
        });
        this.inputEmail.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const value = target.value;
            this.events.emit(settings.events.contacts.form.input, {email: value});
        });

        this.inputPhone.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const value = target.value;
            this.events.emit(settings.events.contacts.form.input, {phone: value});
        });
    }
}