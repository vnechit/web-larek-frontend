import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IModalData } from '../../types/common/Modal';
import { settings } from '../../utils/constants';

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>(
      settings.modals.close,
      container
    );
    this._content = ensureElement<HTMLElement>(settings.modals.content, container);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add(settings.modals.active);
    this.events.emit(settings.events.modal.open);
  }

  close() {
    this.container.classList.remove(settings.modals.active);
    this.content = null;
    this.events.emit(settings.events.modal.close);
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
