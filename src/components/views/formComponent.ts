import { Component } from "./component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { settings } from "../../utils/constants";


export abstract class Form<T> extends Component<T> {
    protected events: IEvents;
    protected _isValid: boolean;
    protected button: HTMLButtonElement;
    protected error: HTMLElement;

    constructor(protected container: HTMLElement, events: IEvents, button: string) {
        super(container);

        this.events = events;

        this.error = ensureElement<HTMLElement>(settings.page.form.error, this.container);
        this.button = ensureElement<HTMLButtonElement>(button, this.container);       
    }

    set isValid(value: boolean) {
        this._isValid = value;
        this.button.disabled = !value;
    }

    abstract validateForm (): void;
}