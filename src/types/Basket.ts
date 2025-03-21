import { IProduct } from "./index";


export interface IBasket {
  list: HTMLElement[];
  price: number;
}

export interface IStoreItemBasketActions {
    onClick: (event: MouseEvent) => void;
}

export interface IProductBasket extends IProduct {
  id: string;
  index: number;
}