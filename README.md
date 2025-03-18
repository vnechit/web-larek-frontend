# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Интерфейсы и типы данных

/* Тип описывающий все возможные категории товара */
type ProductCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';
    
/* Интерфейс, описывающий карточку товара */
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: ProductCategory;
  price: number | null;
  isSelected: boolean;
}

/* Доступные спсобы оплаты */
type PayMethod = 'cash' | 'card';

/* Данные юзера */
interface IUser {
    address: string;
	email: string;
	phone: string;
    payment: PayMethod;
}

/* Заказ */
interface IOrder {
    items: IProduct[];
	user: IUser;
    total: number;
}

/* Корзина */
interface IBasket {
    list: IProduct[];
    price: number;
}

/*
    Интерфейс, описывающий внутренне состояние приложения
    Используется для хранения карточек, корзины, заказа пользователя, ошибок
    в формах
    Так же имеет методы для работы с карточками и корзиной
*/
interface IAppState {
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

## Классы

/* Базовая модель, чтобы можно было отличить ее от простых объектов с данными */
abstract class Model<T> {
  constructor(data: Partial<T>, protected events: IEvents) {}
  emitChanges(event: string, payload?: object) {}
}

/* Класс, описывающий состояние приложения */
export class AppState extends Model<IAppState> {
  basket: IProduct[] = [];
  store: IProduct[];
  order: IOrder = {};
  addToBasket(value: IProduct): void;
  deleteFromBasket(id: string): void;
  clearBasket(): void;
  getBasketAmount(): number;
  getTotalBasketPrice(): number;
  setItems(): void;
  refreshOrder(): boolean;
  setStore(items: IProduct[]): void;
  resetSelected(): void;
}