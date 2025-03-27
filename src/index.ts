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
const page = ensureElement<HTMLElement>(settings.page.wrapper);
const basketCounter = ensureElement<HTMLElement>(settings.page.basketCounter);
const basketButton = ensureElement<HTMLElement>(settings.page.basket);

// Base Api and Events
const api = new Api(API_URL);
const events = new EventEmitter();

// Data classes
const productsData = new ProductsData(events);
const basketData = new BasketData(events);
const userData = new User(events);
// Views classes
const cardsContainer = new CardsContainer(ensureElement<HTMLElement>(settings.page.gallery));
const modal = new Modal(modalElement, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

await api.get('/product')
.then((res: ApiListResponse<IProduct>) => {
  productsData.list = res.items;   
  const productCards: HTMLElement[] = productsData.list.map((element: IProduct) => new CardStore(cloneTemplate(cardTemplate), events).render(element));
  cardsContainer.render({catalog: productCards}); 
  basketData.list = [];    
}).catch((err) => {
  console.error(err);
});

// Additional functions
function updateBasketCounter (value: number) {
  basketCounter.textContent = String(value);
}

// Events handlers

function handleAddToBasket (product: Partial<IProduct>) {
  basketData.addProduct(productsData.getProduct(product.id));
  productsData.markProduct(product.id, true);  
  updateBasketCounter(basketData.count);
}

function handleOpenCardPreview (card: Partial<IProduct>) {
  const productToShow: IProduct = productsData.getProduct(card.id);  
  const productToShowElement: HTMLElement = new CardPreview(cloneTemplate(cardPreviewTemplate), events).render(productToShow);    
  modal.render({content: productToShowElement});
  modal.open();
}

function handleModalOpenned () {
  page.classList.add(settings.page.lockScroll);
}

function handleModalClose () {  
  page.classList.remove(settings.page.lockScroll);
}

function handleOpenBasket () { 
  const productsInBasket: HTMLElement[] = basketData.list.map((element, ind) => new CardBasket(cloneTemplate(basketCardTemplate), events).render(element, ind+1));
  const basketToShow = basket.render({list: productsInBasket}, basketData.total);  
  modal.render({content: basketToShow});
  modal.open();
}

function handleBasketOrder () {
  const order = new Order(cloneTemplate(orderTemplate), events).render({isValid: false});
  modal.render({content: order});
}

function hadleDeleteFromBasket (product: Partial<IProduct>) {
  basketData.removeProduct(productsData.getProduct(product.id));
  productsData.markProduct(product.id, false);  
  updateBasketCounter(basketData.count);
  handleOpenBasket();
}

function handleOrderFormSubmit (data: Partial<TUserOrder>) {          
  userData.setOrderDetails(data.payment, data.address);  
  const contacts = new Contacts(cloneTemplate(contactsTemplate), events).render({isValid: false});
  modal.render({content: contacts});
}

async function handleContactsFormSubmit (data: Partial<TUserContacts>) {
  userData.setContactDetails(data.email, data.phone);  
  const toSend = {...userData.getUserInfo(), ...{items: basketData.getIds(), total: basketData.total}};  
  await api.post('/order', toSend)
    .then((res: IOrderAnswer) => {
      const success = new Success(cloneTemplate(successTemplate), events).render({}, res.total);
      modal.render({content: success});
  })
  .catch((err) => {
    console.log(err)
  })
}

function handleSuccessOrder () {
  modal.close();
  basketData.getIds().forEach((element) => {
    productsData.markProduct(element, false); 
  });
  basketData.clearBasket();
  updateBasketCounter(0);
}

// Events listeners

basketButton.addEventListener('click', handleOpenBasket);

events.on(settings.events.card.toBasket, handleAddToBasket);
events.on(settings.events.card.select, handleOpenCardPreview);
events.on(settings.events.modal.open, handleModalOpenned);
events.on(settings.events.modal.close, handleModalClose);
events.on(settings.events.basket.order, handleBasketOrder);
events.on(settings.events.basket.delete, hadleDeleteFromBasket);
events.on(settings.events.order.submit, handleOrderFormSubmit);
events.on(settings.events.contacts.submit, handleContactsFormSubmit);
events.on(settings.events.order.success, handleSuccessOrder);