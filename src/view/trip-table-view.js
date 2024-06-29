import AbstractView from '../framework/view/abstract-view.js';

function createTripTableTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class TripTableView extends AbstractView {
  get template() {
    return createTripTableTemplate();
  }

  // getElement() {
  //   if (!this.element) {
  //     this.element = createElement(this.getTemplate());
  //   }

  //   return this.element;
  // }

  // removeElement() {
  //   this.element = null;
  // }
}
