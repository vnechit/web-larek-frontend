/* Тип описывающий все возможные категории товара */
export type ProductCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';
    
/* Интерфейс, описывающий карточку товара в магазине */
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: ProductCategory;
  price: number | null;
  isSelected: boolean;
}

/* Доступные спсобы оплаты */
export type PayMethod = 'cash' | 'card';

/* Данные юзера */
export interface IUser {
    address: string;
	email: string;
	phone: string;
    payment: PayMethod;
}

/* Заказ */
export interface IOrder {
    items: IProduct[];
	user: IUser;
    total: number;
}

/* Корзина */
export interface IBasket {
    list: IProduct[];
    price: number;
}

/*
    Интерфейс, описывающий внутренне состояние приложения
    Используется для хранения карточек, корзины, заказа пользователя, ошибок
    в формах
    Так же имеет методы для работы с карточками и корзиной
*/
export interface IAppState {
  basket: IBasket;
  store: IProduct[];
  order: IOrder;
  addToBasket(value: IProduct): void;
  deleteFromBasket(id: string): void;
  clearBasket(): void;
  getBasketAmount(): number;
  getTotalBasketPrice(): number;
  refreshOrder(): boolean;
  setStore(items: IProduct[]): void;
  resetSelected(): void;
}
