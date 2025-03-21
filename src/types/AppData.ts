import { Product } from '../components/AppData';
import { IOrder, IOrderForm, FormErrors } from './Order';
import { IProduct } from './index';

export interface IAppState {
  basket: Product[];
  store: Product[];
  order: IOrder;
  formErrors: FormErrors;
  addToBasket(value: Product): void;
  deleteFromBasket(id: string): void;
  clearBasket(): void;
  getBasketAmount(): number;
  getTotalBasketPrice(): number;
  setItems(): void;
  setOrderField(field: keyof IOrderForm, value: string): void;
  validateContacts(): boolean;
  validateOrder(): boolean;
  refreshOrder(): boolean;
  setStore(items: IProduct[]): void;
  resetSelected(): void;
}