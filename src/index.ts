import { Page } from './components/Page';
import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { StoreItem, StoreItemPreview } from './components/Card';
import { AppState, Product } from './components/AppData';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ApiResponse, IProduct } from './types';
import { IOrderForm } from './types/Order';
import { API_URL } from './utils/constants';
import { Basket, StoreItemBasket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';
import { settings } from './utils/constants';

import './scss/styles.scss';


const api = new Api(API_URL);
const events = new EventEmitter();

// Шаблоны
const storeProductTemplate = ensureElement<HTMLTemplateElement>(settings.templates.card);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(settings.templates.cardPreview);
const basketTemplate = ensureElement<HTMLTemplateElement>(settings.templates.basket);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>(settings.templates.cardBasket);
const orderTemplate = ensureElement<HTMLTemplateElement>(settings.templates.order);
const contactsTemplate = ensureElement<HTMLTemplateElement>(settings.templates.contacts);
const successTemplate = ensureElement<HTMLTemplateElement>(settings.templates.success)

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>(settings.modals.container), events);

// Переиспользуемые компоненты
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new Order('order', cloneTemplate(orderTemplate), events)
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
  onClick: () => {
    events.emit(settings.events.modal.close)
    modal.close()
  }
})

// Получаем лоты с сервера
api
  .get('/product')
  .then((res: ApiResponse) => {
    appData.setStore(res.items as IProduct[]);
  })
  .catch((err) => {
    console.error(err);
  });

// Изменились элементы каталога
events.on(settings.events.items.changed, () => {
  page.store = appData.store.map((item) => {
    const product = new StoreItem(cloneTemplate(storeProductTemplate), {
      onClick: () => events.emit(settings.events.card.select, item),
    });
    return product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});

// Открытие карточки
events.on(settings.events.card.select, (item: Product) => {
  page.locked = true;
  const product = new StoreItemPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit(settings.events.card.toBasket, item)
    },
  });
  modal.render({
    content: product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      description: item.description,
      price: item.price,
      selected: item.selected
    }),
  });
});

// Добавление товара в корзину
events.on(settings.events.card.toBasket, (item: Product) => {
  item.selected = true;
  appData.addToBasket(item);
  page.counter = appData.getBasketAmount();
  modal.close();
})

// Открытие корзины
events.on(settings.events.basket.open, () => {
  page.locked = true
  const basketItems = appData.basket.map((item, index) => {
    const storeItem = new StoreItemBasket(
      'card',
      cloneTemplate(cardBasketTemplate),
      {
        onClick: () => events.emit(settings.events.basket.delete, item)
      }
    );
    return storeItem.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });
  modal.render({
    content: basket.render({
      list: basketItems,
      price: appData.getTotalBasketPrice(),
    }),
  });
});

// Удалить товар из корзины
events.on(settings.events.basket.delete, (item: Product) => {
  appData.deleteFromBasket(item.id);
  item.selected = false;
  basket.price = appData.getTotalBasketPrice();
  page.counter = appData.getBasketAmount();
  basket.refreshIndices();
  if (!appData.basket.length) {
    basket.disableButton();
  }
})

// Оформить заказ
events.on(settings.events.basket.order, () => {
  modal.render({
    content: order.render(
      {
        address: '',
        valid: false,
        errors: []
      }
    ),
  });
});

// Изменилось состояние валидации заказа
events.on(settings.events.order.form.error, (errors: Partial<IOrderForm>) => {
  const { payment, address } = errors;
  order.valid = !payment && !address;
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации контактов
events.on(settings.events.contacts.form.error, (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// Изменились введенные данные
events.on(settings.events.order.form.input, (data: { field: keyof IOrderForm, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

// Заполнить телефон и почту
events.on(settings.events.order.submit, () => {
  appData.order.total = appData.getTotalBasketPrice()
  appData.setItems();
  modal.render({
    content: contacts.render(
      {
        valid: false,
        errors: []
      }
    ),
  });
})

// Покупка товаров
events.on(settings.events.contacts.submit, () => {
  api.post('/order', appData.order)
    .then((res) => {
      events.emit(settings.events.order.success, res);
      appData.clearBasket();
      appData.refreshOrder();
      order.disableButtons();
      page.counter = 0;
      appData.resetSelected();
    })
    .catch((err) => {
      console.log(err)
    })
})

// Окно успешной покупки
events.on(settings.events.order.success, (res: ApiListResponse<string>) => {
  modal.render({
    content: success.render({
      description: res.total
    })
  })
})

// Закрытие модального окна
events.on(settings.events.modal.close, () => {
  page.locked = false;
  appData.refreshOrder();
});
