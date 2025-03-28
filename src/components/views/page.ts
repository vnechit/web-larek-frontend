import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./component";


interface IPage {
    basketCounter: HTMLElement;
    basketButton: HTMLButtonElement;
}

export class Page extends Component<IPage> {
    protected _basketCounter: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected events: IEvents;

    constructor (protected container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;

        this._basketCounter = ensureElement<HTMLElement>(settings.page.basketCounter);
        this.basketButton = ensureElement<HTMLButtonElement>(settings.page.basket);

        this.basketButton.addEventListener('click', () => {
            this.events.emit(settings.events.basket.open);
        });
    }

    toggleLockScroll () {
        this.container.classList.toggle(settings.page.lockScroll);
    }

    set basketCounter (value: number) {
        this._basketCounter.textContent = String(value);
    }
}