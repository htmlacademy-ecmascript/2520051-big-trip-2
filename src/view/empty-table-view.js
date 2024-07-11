import AbstractView from '../framework/view/abstract-view.js';

function createEmptyTableTemplate(msg) {
  return `<p class="trip-events__msg">${msg}</p>`;
}

export default class EmptyTableView extends AbstractView {
  #msg = '';
  constructor (msg) {
    super();
    this.#msg = msg;
  }

  get template() {
    return createEmptyTableTemplate(this.#msg);
  }
}
