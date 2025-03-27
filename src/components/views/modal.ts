import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./component";

interface IModel {
    content: HTMLElement;
}

export class Modal extends Component<IModel> {
    protected events: IEvents;
    protected _content: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor (protected container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;

        this._content = ensureElement<HTMLElement>(settings.modals.content, this.container);

        this.closeButton = ensureElement<HTMLButtonElement>(settings.modals.close, this.container);
        this.closeButton.addEventListener('click', ()=>{
            this.close();
        });
        this.container.addEventListener('click', (event) => {
            if (event.target instanceof Element) {
                if (event.target.classList.contains(settings.modals.active)) {
                    this.close();
                }
            }
        });
    }

    set content (value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open () {        
        this.container.classList.add(settings.modals.active);
        this.events.emit(settings.events.modal.open);
    }

    close () {
        this.container.classList.remove(settings.modals.active);
        this._content.innerHTML = '';
        this.events.emit(settings.events.modal.close);
    }

}