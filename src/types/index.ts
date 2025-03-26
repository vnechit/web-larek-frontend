// Types
export type TCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';
export type TPayMethod = 'cash' | 'card';

// Interfaces
export interface IProduct {
  id: string;
  title: string;
  price: number | null;
  img: string;
  category: string;
  description: string;
  isSelected: boolean;
}

export interface IUser {
  address: string | null;
	email: string | null;
	phone: string | null;
  payment: TPayMethod | null;
}

export interface IProductsData {
  list: IProduct[];
  addProduct (product: IProduct): void;
  deleteProduct (productId: string) : void;
  getProduct (productId: string) : IProduct;
}

export interface IBasket {
  list: IProduct[];
  total: number;
  count: number;
}