import { IUser, TPayMethod, TUserContacts, TUserOrder } from "../../types";
import { settings } from "../../utils/constants";
import { IEvents } from "../base/events";


export class User implements IUser{
    protected _address: string;
    protected _email: string | null;
    protected _phone: string | null;
    protected _payment: TPayMethod | null;
    protected events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
        this._address = '';
        this._email = '';
        this._payment = '';
        this._phone = '';
    }

    set address (value: string) {
        this._address = value;
    }

    get address () {
        return this._address;
    }

    set email (value: string) {
        this._email = value;
    }

    get email () {
        return this._email;
    }

    set phone (value: string) {
        this._phone = value;
    }

    get phone () {
        return this._phone;
    }

    set payment (value: TPayMethod) {
        this._payment = value;
    }

    get payment () {
        return this._payment;
    }

    setOrderDetails (data: Partial<TUserOrder>) {                                           
        if (!data.payment) {
            this.address = data.address
        }
        if (data.payment) {
            this.payment = data.payment;
        }
        if (!this.payment?.length) {
            this.events.emit(settings.events.order.form.error, {error: 'Выберите способ оплаты'});
            return;
        }
        if (!this.address?.length) {
            this.events.emit(settings.events.order.form.error, {error: 'Введите адресс'});
            return;
        }
        this.events.emit(settings.events.order.ready);        
    }

    setContactDetails (data: Partial<TUserContacts>) {        
        if (Object.keys(data).some(element => element === 'email')) {            
            this.email = data.email
        }
        if (Object.keys(data).some(element => element === 'phone')) {
            this.phone = data.phone;
        }
        if (!this.email?.length) {
            this.events.emit(settings.events.contacts.form.error, {error: 'Введите email'});
            return;
        }
        if (!this.phone?.length) {
            this.events.emit(settings.events.contacts.form.error, {error: 'Введите телефон'});
            return;
        }
        this.events.emit(settings.events.contacts.ready); 
    }

    getUserInfo (): IUser {
        return {email: this._email, address: this._address, phone: this._phone, payment: this._payment};
    }
}