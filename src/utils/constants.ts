export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;


export const settings = {
    page: {
        basketCounter: '.header__basket-counter',
        gallery: '.gallery',
        wrapper: '.page__wrapper',
        basket: '.header__basket',
        lockScroll: 'page__wrapper_locked',
        activeButton: 'button_alt-active',
        form: {
            error: '.form__errors'
        },
        modal: '#modal-container',
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
        container: '.modal-container',
        close: '.modal__close',
        content: '.modal__content',
        active: 'modal_active'
    },
    card: {
        title: '.card__title',
        image: '.card__image',
        description: '.card__text',
        price: '.card__price',
        button: '.card__button',
        category: '.card__category',
        buttonBasket: '.basket__item-delete'
    },
    basket: {
        price: '.basket__price',
        button: '.basket__button',
        basketItemIndex: '.basket__item-index',
        list: '.basket__list', 
        order: '.order__button',
        success: '.order-success__close',
        description: '.order-success__description'
    },
    events: {
        modal: {
            close: 'modal:close',
            open: 'modal:open',
        },
        items: {
            changed: 'items:changed'
        },
        card: {
            select: 'card:select',
            toBasket: 'card:toBasket'
        },
        basket: {
            delete: 'basket:delete',
            order: 'basket:order',
            open: 'basket:open'
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
