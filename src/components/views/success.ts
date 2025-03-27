import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./component";

interface ISuccess {
    total: HTMLElement;
}

export class Success extends Component<ISuccess> {
    protected events: IEvents;
    protected _total: HTMLElement;
    protected button: HTMLButtonElement;

    constructor (protected container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;

        this._total = ensureElement<HTMLElement>(settings.basket.description, this.container);
        this.button = ensureElement<HTMLButtonElement>(settings.basket.success, this.container);
        this.button.addEventListener('click', () => {
            this.events.emit(settings.events.order.success);
        });
    }

    set total (value: number) {
        this._total.textContent = 'Списано ' + value + ' синапсов';
    }

    render (data?: Partial<ISuccess>, total?: number): HTMLElement {
        this.total = total;
        return super.render(data);
    }
}