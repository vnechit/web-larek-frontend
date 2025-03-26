import { IUser, TPayMethod } from "../../types";
import { IEvents } from "../base/events";


export class User implements IUser{
    protected _address?: string;
    protected _email?: string | null;
    protected _phone?: string | null;
    protected _payment?: TPayMethod | null;
    protected events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
    }

    set address (value: string) {
        this._address = value;
    }

    set email (value: string) {
        this._email = value;
    }

    set phone (value: string) {
        this._phone = value;
    }

    set payment (value: TPayMethod) {
        this._payment = value;
    }
}