import AbstractView from '../framework/view/abstract-view.js';

function createTripTableTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class TripTableView extends AbstractView {
  get template() {
    return createTripTableTemplate();
  }
}
