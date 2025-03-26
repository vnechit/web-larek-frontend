import { settings } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./component";

interface IOrder {

}

export class Order extends Component<IOrder>{
    protected events: IEvents;

    constructor (protected container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
    }
}