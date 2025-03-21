export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
import { CategoryMapping } from '../types';


export const settings = {
    page: {
        basketCounter: '.header__basket-counter',
        gallery: '.gallery',
        wrapper: '.page__wrapper',
        basket: '.header__basket',
        lockScroll: 'page__wrapper_locked',
        activeButton: 'button_alt-active',
        basketItemIndex: '.basket__item-index',
        form: {
            error: '.form__errors'
        }
    },
    templates: {
        card: '#card-catalog',
        cardPreview: '#card-preview',
        cardBasket: '#card-basket',
        basket: '#basket',
        order: '#order',
        contacts: '#contacts',
        success: '#success'
    },
    modals: {
        container: '#modal-container',
        close: '.modal__close',
        content: '.modal__content',
        active: 'modal_active'
    },
    events: {
        modal: {
            close: 'modal:close',
            open: 'modal:open'
        },
        items: {
            changed: 'items:changed'
        },
        card: {
            select: 'card:select',
            toBasket: 'card:toBasket'
        },
        basket: {
            open: 'basket:open',
            delete: 'basket:delete',
            order: 'basket:order'
        },
        order: {
            success: 'order:success',
            submit: 'order:submit',
            ready: 'order:ready',
            form: {
                error: 'orderFormErrors:change',
                input: 'orderInput:change'
            }
        },
        contacts: {
            submit: 'contacts:submit',
            ready: 'contacts:ready',
            form: {
                error: 'contactsFormErrors:change'
            }
        }
    }
};

export const categoryMapping: CategoryMapping = {
    'другое': 'card__category_other',
    'софт-скил': 'card__category_soft',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
    'хард-скил': 'card__category_hard',
  };
