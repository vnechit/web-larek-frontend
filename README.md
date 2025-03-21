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

Приложение основано на упрощенной версии шаблона проектирования MVP. В данном контексте все приложение содержит общий "Presenter", который координирует работу всех View и Model через событийно-ориентированный подход, используя механизм сообщений, которые возникают в результате определенных событий внутри отображений и моделей

## Интерфейсы и типы данных

```TypeScript

// Тип описывающий все возможные категории товара
type ProductCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';
    
// Интерфейс, описывающий карточку товара
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: ProductCategory;
  price: number | null;
  isSelected: boolean;
}

// Доступные спсобы оплаты
type PayMethod = 'cash' | 'card';

// Данные юзера
interface IUser {
  address: string;
	email: string;
	phone: string;
  payment: PayMethod;
}

// Заказ
interface IOrder {
  items: IProduct[];
	user: IUser;
  total: number;
}

// Корзина
interface IBasket {
    list: IProduct[];
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

// Интерфейс описывающий страницу
interface IPage {
  counter: number;
  store: HTMLElement[];

  // Переключатель для блокировки
  // Отключает прокрутку страницы
  locked: boolean;
}

```

## Классы

```TypeScript

// Базовая модель, чтобы можно было отличить ее от простых объектов с данными 
abstract class Model<T> {
  // Принимает данные для хранения, эвент эмиттер
  constructor(data: Partial<T>, protected events: IEvents) {}
  // Вызывает эвент
  emitChanges(event: string, payload?: object) {}
}

// Класс, описывающий состояние приложения
class AppState extends Model<IAppState> {
  // Корзина с товарами
  basket: IProduct[] = [];
  // Массив со всеми товарами
  store: IProduct[];
  // Объект заказа клиента
  order: IOrder = {};
  // Метод для добавления товара в корзину
  addToBasket(value: IProduct): void;
  // Метод для удаления товара из корзины
  deleteFromBasket(id: string): void;
  // Метод для полной очистки корзины
  clearBasket(): void;
  // Метод для получения количества товаров в корзине
  getBasketAmount(): number;
  // Метод для получения суммы цены всех товаров в корзине
  getTotalBasketPrice(): number;
  // Метод для добавления ID товаров в корзине в поле items для order
  setItems(): void;
  // Очистить order после покупки товаров
  refreshOrder(): boolean;
  // Метод для превращения данных, полученых с сервера в тип данных приложения
  setStore(items: IProduct[]): void;
  // Метод для обновления поля selected во всех товарах после совершения покупки
  resetSelected(): void;
}

```

## Классы представления

```TypeScript

// Базовый компонен
abstract class Component<T> {
  // Конструктор принимает родительский элемент
  protected constructor(protected readonly container: HTMLElement);

  // Переключить класс
  toggleClass(element: HTMLElement, className: string, force?: boolean): void;

  // Установить текстовое содержимое
  protected setText(element: HTMLElement, value: string): void;

  // Сменить статус блокировки
  setDisabled(element: HTMLElement, state: boolean): void;

  // Скрыть
  protected setHidden(element: HTMLElement): void;

  // Показать
  protected setVisible(element: HTMLElement): void;

  // Установить изображение с алтернативным текстом
  protected setImage(el: HTMLImageElement, src: string, alt?: string): void;

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement;
}


// Класс, описывающий главную страницу
class Page extends Component<IPage> {
  // Ссылки на внутренние элементы
  protected _counter: HTMLElement;
  protected _store: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  // Конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLElement, protected events: IEvents);

  // Установить счётчик товаров в корзине
  set counter(value: number);

  // Сеттер для карточек товаров на странице
  set store(items: HTMLElement[]);

  // Блок/анблок скролла
  set locked(value: boolean);
}

// Класс, описывающий карточку товара 
class Card extends Component<IProduct> {
  // Ссылки на внутренние элементы карточки
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский контейнер
  // и объект с колбэк функциями
  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions);

  // Сеттер и геттер для уникального ID
  set id(value: string);
  get id(): string;

  // Сеттер и гетер для названия
  set title(value: string);
  get title(): string;

  // Сеттер для кратинки
  set image(value: string);

  // Сеттер для определения выбрали товар или нет
  set isSelected(value: boolean);

  // Сеттер для цены
  set price(value: number | null);

  // Сеттер для категории
  set category(value: CategoryType);
}

// Класс, описывающий корзину товаров
export class Basket extends Component<IBasket> {
  // Ссылки на внутренние элементы
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents);

  // Сеттер для общей цены
  set price(price: number);

  // Сеттер для списка товаров 
  set list(items: HTMLElement[]);

  // Метод отключающий кнопку "Оформить"
  disableButton(): void;

  // Метод для обновления индексов таблички при удалении товара из корзины
  refreshIndices(): void;
}

// Класс, описывающий окошко заказа товара 
export class Order extends Form<IOrder> {
  // Сссылки на внутренние элементы
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents);

  // Метод, отключающий подсвечивание кнопок
  disableButtons(): void;
}

```

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