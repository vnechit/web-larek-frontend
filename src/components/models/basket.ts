import { IBasket, IProduct } from "../../types";
import { settings } from "../../utils/constants";
import { IEvents } from "../base/events";


export class BasketData implements IBasket{
    protected _list: IProduct[];
    protected _total: number;
    protected _count: number;
    protected events: IEvents;
      
    constructor (events: IEvents) {
        this.events = events;
        this.total = 0;
        this.count = 0;
    }

    set list (values: IProduct[]) {
        this._list = values || [];
    }

    get list () {
        return this._list;
    }

    set total (value: number) {
        this._total = value;
    }

    get total () {
        return this._total;
    }

    set count (value: number) {
        this._count = value;
    }

    get count () {
        return this._count;
    }

    addProduct (value: IProduct) {
        this._list.push(value);
        this.count++;
        this.total += value.price;
    }

    removeProduct (value: IProduct) {
        this.total -= value.price;
        this._list = this._list.filter((element) => element.id !== value.id);
        this.count--;
    }

    clearBasket () {
        this._list = [];
        this._count = 0;
        this._total = 0;
    }

    getIds () {
        return this.list.map((element) => element.id);
    }
}