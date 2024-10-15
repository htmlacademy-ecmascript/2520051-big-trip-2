import { DateFormat } from '../constants.js';
import { getDatetimeFormat, getDifferenceDate } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';


const createOfferItem = (offers, offersByType) => {
  const listItems = [];
  offers.forEach((offer) => {
    const offerInfo = offersByType.offers.find((offerItem) => offerItem.id === offer);
    listItems.push(
      `<li class="event__offer">
      <span class="event__offer-title">${offerInfo.title}</span>
      +€&nbsp;
      <span class="event__offer-price">${offerInfo.price}</span>
    </li>`
    );
  });
  return (listItems.join(''));
};

const createPointTemplate = (point, offersByType, destination) => {
  const isFavoriteClassName = point.isFavorite ? 'event__favorite-btn--active' : '';
  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${getDatetimeFormat(point.dateFrom, DateFormat.DATE_DB)}">${getDatetimeFormat(point.dateFrom, DateFormat.HUMAN)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${getDatetimeFormat(point.dateFrom, DateFormat.DATE_TIME)}">${getDatetimeFormat(point.dateFrom, DateFormat.TIME)}</time>
            —
            <time class="event__end-time" datetime="${getDatetimeFormat(point.dateTo, DateFormat.DATE_TIME)}">${getDatetimeFormat(point.dateTo, DateFormat.TIME)}</time>
          </p>
          <p class="event__duration">${getDifferenceDate(point.dateTo, point.dateFrom)}</p>
        </div>
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
${createOfferItem(point.offers, offersByType)}
        </ul>
        <button class="event__favorite-btn ${isFavoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
    `
  );
};

export default class TripPointView extends AbstractView {
  #point = null;
  #offers = null;
  #destination = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;
  #offersByType = null;

  constructor(point, offersAll, destination, onEditClick, onFavoriteClick) {
    super();
    this.#point = point;
    this.#offers = offersAll;
    this.#destination = destination;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.#offersByType = this.#offers.find((offer) => offer.type === this.#point.type);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#clickEditHandler);

    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#clickFavoriteHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offersByType, this.#destination);
  }

  #clickEditHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #clickFavoriteHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
