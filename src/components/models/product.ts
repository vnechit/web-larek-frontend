import { IProduct, IProductsData } from "../../types";
import { settings } from "../../utils/constants";
import { IEvents } from "../base/events";

export class ProductsData implements IProductsData {
    protected _list: IProduct[];
    protected events: IEvents;
      
    constructor (events: IEvents) {
        this.events = events;
    }

    set list (list: IProduct[]) {
        this._list = list;     
        this.events.emit(settings.events.items.changed);
    }

    get list () {
        return this._list;
    }

    addProduct (product: IProduct): void {
        this._list.push(product);
        this.events.emit(settings.events.items.changed);
    }

    deleteProduct (productId: string) : void {
        this._list = this._list.filter((element) => element.id !== productId);
        this.events.emit(settings.events.items.changed);
    }

    getProduct (productId: string) : IProduct {
        return this._list.find((element) => element.id === productId);
    }

    markProduct (productId: string, value: boolean) : void {
        this._list.forEach((element) => {
            if (element.id === productId) {
                element.isSelected = value;
            }
        })
    }
}