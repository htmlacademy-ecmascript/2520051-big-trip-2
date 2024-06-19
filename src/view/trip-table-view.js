import {createElement} from '../render.js';

function createTripTableTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class TripTableView {
  getTemplate() {
    return createTripTableTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
