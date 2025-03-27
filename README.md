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

## Общая концепция работы приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой данных (отвечает за хранение и изменение данных)
- слой отображения (отвечает за отображение данных на странице)
- презентер (отвечает за связь данных и отображения)

## Интерфейсы и типы данных

### Types

```TypeScript
// Тип, описывающий возможные категории продуктов
type TCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';
// Тип, описывающий возможные способы оплаты
type TPayMethod = 'cash' | 'card' | '';
// Тип, описывающий данные из первой формы
type TUserOrder = Pick<IUser, 'address' | 'payment'>;
// Тип, опимывающий данные из второй формы
type TUserContacts = Pick<IUser, 'email' | 'phone'>;
```

### Interfaces

```TypeScript
// Интерфейс продукта
interface IProduct {
  id: string;
  title: string;
  price: number | null;
  img: string;
  category: string;
  description: string;
  isSelected: boolean;
}

// Интерфейс пользователя
interface IUser {
    address: string | null;
    email: string | null;
	phone: string | null;
    payment: TPayMethod | null;
}

// Интерфейс хранилища карточек
interface IProductsData {
  list: IProduct[];
  addProduct (product: IProduct): void;
  deleteProduct (productId: string) : void;
  getProduct (productId: string) : IProduct;
}

// Интерфейс корзины
interface IBasket {
  list: IProduct[];
  total: number;
  count: number;
}

// Интерфейс ответа сервера после покупки
interface IOrderAnswer {
  id: string,
  total: number
}
```

## Архитектура приложения

### Слой данных

#### Класс User

```TypeScript
// Класс, отвечающий за работу с данными пользователя
class User implements IUser {
    // адрес
    protected _address?: string;
    // электронная почта
    protected _email?: string | null;
    // номер телефона
    protected _phone?: string | null;
    // способ оплаты
    protected _payment?: TPayMethod | null;
    // свойство, отвечающее за работу с событиями
    protected events: IEvents;

    // конструктор принимает объект слушателя событий
    constructor (events: IEvents) {}

    // устанавливает адрес пользователя
    set address (value: string) {}

    // устанавливает почту пользователя
    set email (value: string) {}

    // устанавливает номер телефона пользователя
    set phone (value: string) {}

    // устанавливает выбранные способ оплаты
    set payment (value: TPayMethod) {}

    // устанавливает данные, полученные из первой формы
    setOrderDetails (payment: TPayMethod, address: string) {}

    // устанавливает данные, полученные из второй формы
    setContactDetails (email: string, phone: string) {}

    // возвращает объет с данными пользователя
    getUserInfo (): IUser {}
}
```

#### Класс ProductsData

```TypeScript
// Класс, отвечающий за работу с товарами
class ProductsData implements IProductsData {
    // список товаров
    protected _list: IProduct[];
    // объект слушателя событий
    protected events: IEvents;
      
    // конструктор принимает объект слушателя событий
    constructor (events: IEvents) {}

    // устанавливает список товаров
    set list (list: IProduct[]) {}

    // возвращает список товаров
    get list () {}

    // добавляет товар в список
    addProduct (product: IProduct): void {}

    // удаляет товар из списка по его ID
    deleteProduct (productId: string) : void {}
 
    // возвращает товар по его ID
    getProduct (productId: string) : IProduct {}

    // отмечает товар, как добавленный в корзину
    markProduct (productId: string, value: boolean) : void {}
}
```

#### Класс BasketData

```TypeScript
// Класс, отвечающий за работу корзины
class BasketData implements IBasket {
    // товары в корзине
    protected _list: IProduct[];
    // стоимость товаров в корзине
    protected _total: number;
    // количество товаров в корзине
    protected _count: number;
    // объект слушателя событий
    protected events: IEvents;
      
    // конструктор принимает объект слушателя событий
    constructor (events: IEvents) {}

    // устанавливает список товаров в корзине
    set list (values: IProduct[]) {}

    // возвращает список товаров в корзине
    get list () {}

    // устанавливает стоимость всех товаров в корзине
    set total (value: number) {}

    // возвращает стоимость всех товаров в корзине
    get total () {}

    // устанавливает количество товаров в корзине
    set count (value: number) {}

    // возвращает количество товаров в корзине
    get count () {}

    // добавляет товар в корзину
    addProduct (value: IProduct) {}

    // удаляет товар из корзины
    removeProduct (value: IProduct) {}
    
    // очищяет все данные в объекте, приводя ее к первоначальному состоянию
    clearBasket () {}

    // возвращает список ID всех товаров, добавленных в корзину
    getIds () {}
}
```

### Слой отображения

#### Класс Basket

```TypeScript
// Класс, отвечающий за отображение корзины. Наследуется от базового класса компоненты
class Basket extends Component<IBasketList> {
    // список элементов с разметкой товаров в корзине
    protected _list: HTMLElement;
    // кнопка "оформить"
    protected button: HTMLButtonElement;
    // стоимость всех товаров в корзине
    protected _total: HTMLElement;
    // объект слушателя событий
    protected events: IEvents;

    // конструктор принимает на вход шаблон корзины и объект слушателя событий
    constructor(protected container: HTMLElement, events: IEvents) {}

    // устанавливает список элементов с разметкой товаров в корзине
    set list (items: HTMLElement[]) {}

    // устанавливает стоимость всех товаров в корзине
    set total (value: number) {}    

    // переопределяет базовый метод рендера компоненты
    render (data?: Partial<IBasketList>, total?: number): HTMLElement {}
}
```

#### Класс Card

```TypeScript
// Базовый класс, отвечающий за отображение карточки товара. Наследуется от базового класса компоненты
class Card extends Component<IProduct> {
  // объект слушателя событий
  protected events: IEvents;
  // поле названия товара
  protected _title: HTMLElement;
  // поле с ценой товара
  protected _price: HTMLElement;
  // дополнительное поле с ID товара
  protected _id: string;

  // конструктор принимает на вход шаблон карточки и объект слушателя событий
  constructor (protected container: HTMLElement, events: IEvents) {}

  // возвращает ID товара
  get id (): string {}

  // устанавливает ID товара
  set id (value: string) {}

  // устанавливает цену товара
  set price (value: number) {}

  // устанавливает название товара
  set title (value: string) {}
};
```

#### Класс CardStore

```TypeScript
// Класс, отвечающий за отображение карточки товара в магазине. Наследуется от базового класса карточки
class CardStore extends Card {
  // поле категории товара
  protected _category: HTMLElement;
  // поле изображения товара
  protected _image: HTMLImageElement;

  // конструктор принимает на вход шаблонный элемент и оьъект слушателя событий
  constructor(protected container: HTMLElement, events: IEvents) {}

  // устанавливает категорию товара
  set category (value: string) {}

  // устанавливает изображение товара
  set image (value: string) {}

  // вспомогательный метод для установки класса по категории товара
  private setCardCategory (value: string) : string {}
};
```

#### Класс CardPreview

```TypeScript
// Класс, отвечающий за превью товара в модальном окне. Наследуется от класса CardStore, расширяя его содержимое
class CardPreview extends CardStore {
  // поле с описанием товара
  protected _description: HTMLElement;
  // кнопка для добавления товара в корзину
  protected button: HTMLButtonElement;
  // дополнительное поле, отвечающее за поведение кнопки
  protected _isSelected: boolean;

  // конструктор принимает на вход шаблонный элемент и объект слушателя событий
  constructor (protected container: HTMLElement, events: IEvents) {}

  // устанавливает описание товара
  set description (value: string) {}

  // устанавливает "активность" товара
  set isSelected (value: boolean) {}
};
```

#### Класс CardBasket

```TypeScript
// Класс, отвечающий за отображение товара в корзине. Наследуется базового класса Card
class CardBasket extends Card {
  // позиция товара в корзине
  protected _basketIndex: HTMLElement;
  // кнопка для удаления товара из корзины
  protected button: HTMLButtonElement;

  // конструктор принимает на вход шаблонный элемент и объект слушателя событий
  constructor (protected container: HTMLElement, events: IEvents) {}

  // устанавливает позицию товара в корзине
  set basketIndex (value: number) {}

  // переопределяет базовый метод рендере, дополнительно устанавливая позицию товара в корзине
  render (data: Partial<IProduct>, basketIndex?: number): HTMLElement {}
};
```

#### Класс CardsContainer

```TypeScript
// Класс, отвечающий за отображение всех карточек товаров в магазине. Наследуется от базового класса компоненты
class CardsContainer extends Component<ICardsContainer> {
    // поле, хранящее разметку каталога тооваров
    protected _catalog: HTMLElement;

    // конструктор принимает на вход объект слушателя событий
    constructor(protected container: HTMLElement) {}

    // устанавливает разметку каталога товаров
    set catalog (items: HTMLElement[]) {}
}
```

#### Класс Component

```TypeScript
// Базовый абстрактный класс компоненты
abstract class Component<T> {
    // конструктор принимает на вход контейнер
    constructor (protected container: HTMLElement) {}

    // возвращает разметку класса
    render (data?: Partial<T>): HTMLElement {}
};
```

#### Класс Contacts

```TypeScript
// Класс, отвечающий за работу с формой с контактными данными пользователя. Наследуется от базового класса для форм
class Contacts extends Form<IContacts>{
    // поле для ввода электронной почты
    protected inputEmail: HTMLInputElement;
    // поле для ввода номера телефона
    protected inputPhone: HTMLInputElement;
    // дополнительный объект с введенными пользователем данными
    private data: TUserContacts = {
        email: '',
        phone: ''
    };

    // конструктор принимает на вход разметку формы и объект слушателя событий
    constructor (protected container: HTMLElement, events: IEvents) {}

    // метод валидации формы. Устанавливает состояние кнопки
    validateForm () {}
}
```

#### Класс Form

```TypeScript
// Базовый абстрактный класс формы
export abstract class Form<T> extends Component<T> {
    // объект слушателя событий
    protected events: IEvents;
    // поле с состоянием валидности формы
    protected _isValid: boolean;
    // кнопка сабмита на форме
    protected button: HTMLButtonElement;
    // поле, отвечающее за отображение ошибок валидации формы
    protected error: HTMLElement;

    // конструктор принимает на вход контейнер элемента и объект слушателя событий
    constructor(protected container: HTMLElement, events: IEvents, button: string) {}

    // устанавливает состояние валидности формы
    set isValid(value: boolean) {}

    // абстрактный метод для валидации формы
    abstract validateForm (): void;
}
```

#### Класс Modal

```TypeScript
// Класс, отвечающий за работу модального окна. Наследуется от базового компонента
class Modal extends Component<IModel> {
    // объект слушателя событий
    protected events: IEvents;
    // внутрянняя разметка модального окна
    protected _content: HTMLElement;
    // кнопка закрытия модального окна
    protected closeButton: HTMLButtonElement;

    // конструктор принимает на вход контейнер окна и объект слушателя событий. Устанавливает обработчики нажатия на кнопку и оверлей
    constructor (protected container: HTMLElement, events: IEvents) {}

    // устанавливает контент модального окна
    set content (value: HTMLElement) {}

    // открывает модальное окно
    open () {}

    // закрывает модальное окно
    close () {}
}
```

#### Класс Order

```TypeScript
// Класс, отвечающий за работу с первой формой оформления заказа. Наследуется от базового класса форм
class Order extends Form<IOrder> {
    // кнопки, отвечающие за выбор способа оплаты
    protected cashButton: HTMLButtonElement;
    protected cardButton: HTMLButtonElement;
    // поле для ввода адресса пользователя
    protected input: HTMLInputElement;
    // объект, хранящий введенную пользователем информацию
    private data: TUserOrder = {
        payment: '',
        address: ''
    };

    // конструктор принимающий на вход контейнер элемента и объект слушателя событий
    constructor (protected container: HTMLElement, events: IEvents) {}

    // метод для валидации формы
    validateForm () {}
}
```

#### Класс Success

```TypeScript
// Класс, отвечающий за показ экрана успешного оформления заказ
class Success extends Component<ISuccess> {
    // объект слушателя событий
    protected events: IEvents;
    // стоимость покупки
    protected _total: HTMLElement;
    // кнопка закрытия
    protected button: HTMLButtonElement;

    // конструктор принимает на вход контейнер элемента и объект слушателя событий
    constructor (protected container: HTMLElement, events: IEvents) {}

    // устанавливает стоимость покупки
    set total (value: number) {}

    // переопределяет базовый метод рендера компонента
    render (data?: Partial<ISuccess>, total?: number): HTMLElement {}
}
```

### Презентер

Функции презентера выполняет файл index.ts

## Описание событий

```TypeScript
'card:select' // при клике на товар открывает модальное окно с инфо о товаре

'card:toBasket' // добавление товара в корзину

'basket:open' // открывает модальное окно с товарами в корзине

'basket:delete' // удаляет товар из корзины

'basket:order' // открывает окно с формой доставки

'order:submit' // переводит на второй шаг формы доставки

'contacts:submit' // отправляет данные из формы и корзины

'order:success' // открывает модальное окно об успшеной операции

'modal:close' // закрытие модального окна
```