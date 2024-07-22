import AbstractView from '../framework/view/abstract-view.js';

function createEmptyTableTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class EmptyTableView extends AbstractView {
  #message = '';
  constructor (message) {
    super();
    this.#message = message;
  }

  get template() {
    return createEmptyTableTemplate(this.#message);
  }
}
