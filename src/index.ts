// Import yandex base 
import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';
import { settings } from './utils/constants';
// Import types
import { IOrderAnswer, IProduct, TUserContacts, TUserOrder } from './types/index';
// Import models
import { ProductsData } from './components/models/product';
import { BasketData } from './components/models/basket';
import { User } from './components/models/user';
// Import Views
import { CardStore, CardPreview, CardBasket } from './components/views/card';
import { CardsContainer } from './components/views/cardsContainer';
import { Modal } from './components/views/modal';
import { Basket } from './components/views/basket';
import { Order } from './components/views/order';
import { Contacts } from './components/views/contacts';
import { Success } from './components/views/success';
import { Page } from './components/views/page';
// Import styles
import './scss/styles.scss';

// Templates
const cardTemplate = ensureElement<HTMLTemplateElement>(settings.templates.card);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(settings.templates.cardPreview);
const basketTemplate = ensureElement<HTMLTemplateElement>(settings.templates.basket);
const basketCardTemplate = ensureElement<HTMLTemplateElement>(settings.templates.cardBasket);
const orderTemplate = ensureElement<HTMLTemplateElement>(settings.templates.order);
const contactsTemplate = ensureElement<HTMLTemplateElement>(settings.templates.contacts);
const successTemplate = ensureElement<HTMLTemplateElement>(settings.templates.success);

// Other consts elements
const modalElement = ensureElement<HTMLElement>(settings.page.modal);
const cardsContainerElement = ensureElement<HTMLElement>(settings.page.gallery);
const pageElement = ensureElement<HTMLElement>(settings.page.wrapper);

// Base Api and Events
const api = new Api(API_URL);
const events = new EventEmitter();

// Data classes
const productsData = new ProductsData(events);
const basketData = new BasketData(events);
const userData = new User(events);
// Views classes
const cardsContainer = new CardsContainer(cardsContainerElement);
const modal = new Modal(modalElement, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);
const page = new Page(pageElement, events);

// Events handlers

function handleNewProducts () {    
  const productCards: HTMLElement[] = productsData.list.map((element: IProduct) => new CardStore(cloneTemplate(cardTemplate), events).render(element));
  cardsContainer.render({catalog: productCards}); 
}

function handleAddToBasket (product: Partial<IProduct>) {
  basketData.addProduct(productsData.getProduct(product.id));
  productsData.markProduct(product.id, true);  
  page.basketCounter = basketData.count;
  modal.close();
}

function handleOpenCardPreview (card: Partial<IProduct>) {  
  const productToShow: IProduct = productsData.getProduct(card.id);  
  const productToShowElement: HTMLElement = new CardPreview(cloneTemplate(cardPreviewTemplate), events).render(productToShow);    
  modal.render({content: productToShowElement});
  modal.open();
}

function handleModalOpenned () {
  page.toggleLockScroll();
}

function handleModalClose () {   
  page.toggleLockScroll();
}

function handleOpenBasket () { 
  const productsInBasket: HTMLElement[] = basketData.list.map((element, ind) => new CardBasket(cloneTemplate(basketCardTemplate), events).render(element, ind+1));
  const basketToShow = basket.render({list: productsInBasket}, basketData.total);  
  modal.render({content: basketToShow});
  modal.open();
}

function handleBasketButtonPressed () {
  modal.render({content: order.render({isValid: false})});
}

function hadleDeleteFromBasket (product: Partial<IProduct>) {
  basketData.removeProduct(productsData.getProduct(product.id));
  productsData.markProduct(product.id, false);  
  page.basketCounter = basketData.count;
  handleOpenBasket();
}

function handleOrderFormSubmit (data: Partial<TUserOrder>) {          
  userData.setOrderDetails(data.payment, data.address);  
  modal.render({content: contacts.render({isValid: false})});
}

async function handleContactsFormSubmit (data: Partial<TUserContacts>) {
  userData.setContactDetails(data.email, data.phone);  
  const toSend = {...userData.getUserInfo(), ...{items: basketData.getIds(), total: basketData.total}};  
  await api.post('/order', toSend)
    .then((res: IOrderAnswer) => {;
      modal.render({content: success.render({}, res.total)});
      basketData.getIds().forEach((element) => {
        productsData.markProduct(element, false); 
      });
      basketData.clearBasket();
      page.basketCounter = 0;
  })
  .catch((err) => {
    console.log(err)
  })
}

function handleSuccessOrder () {
  modal.close();
}

// Events listeners

events.on(settings.events.items.changed, handleNewProducts);
events.on(settings.events.modal.open, handleModalOpenned);
events.on(settings.events.modal.close, handleModalClose);
events.on(settings.events.card.toBasket, handleAddToBasket);
events.on(settings.events.card.select, handleOpenCardPreview);
events.on(settings.events.basket.open, handleOpenBasket);
events.on(settings.events.basket.order, handleBasketButtonPressed);
events.on(settings.events.basket.delete, hadleDeleteFromBasket);
events.on(settings.events.order.submit, handleOrderFormSubmit);
events.on(settings.events.contacts.submit, handleContactsFormSubmit);
events.on(settings.events.order.success, handleSuccessOrder);


await api.get('/product')
.then((res: ApiListResponse<IProduct>) => {
  productsData.list = res.items; 
}).catch((err) => {
  console.error(err);
});