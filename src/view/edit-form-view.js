import AbstractView from '../framework/view/abstract-view.js';
import { DateFormat } from '../constants.js';
import { getDatetimeFormat } from '../utils.js';

const createOfferItem = (pointOffers, offers) => {
  const listItems = [];
  for (let i = 0; i < offers.length; i++) {
    const isChecked = pointOffers.includes(offers[i].id);
    listItems.push(
      `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${i + 1}" type="checkbox" name="event-offer-luggage" ${isChecked ? 'checked=""' : ''}>
    <label class="event__offer-label" for="event-offer-luggage-${i + 1}">
      <span class="event__offer-title">${offers[i].title}</span>
      +€&nbsp;
      <span class="event__offer-price">${offers[i].price}</span>
    </label>
  </div>`
    );
  }
  return (listItems.join(''));
};

const createTypeList = (types) => {
  const listItems = [];
  for (let i = 0; i < types.length; i++) {
    listItems.push(
      `<div class="event__type-item">
      <input id="event-type-${types[i]}-${i + 1}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${types[i]}">
      <label class="event__type-label  event__type-label--${types[i]}" for="event-type-${types[i]}-${i + 1}">${types[i].charAt(0).toUpperCase() + types[i].slice(1)}</label>
    </div>`
    );
  }
  return (listItems.join(''));
};

const createOffersSection = (offers, offersByType) => {
  if (!offers.length) {
    return '';
  }
  return (
    `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">
  ${createOfferItem(offers, offersByType)}
  </div>
</section>`
  );
};

const createDestinationField = (destinations) => {
  const listItems = [];
  destinations.forEach((destination) => {
    listItems.push(
      `<option value="${destination.name}"></option>`
    );
  });
  return (listItems.join(''));
};

const createPhotoContainer = (photos) => {
  if (!photos.length){
    return '';
  }
  const photoItem = [];
  photos.forEach((photo) => {
    photoItem.push(
      `<img class="event__photo" src="${photo.url}" alt="${photo.description}">`
    );
  });
  return `<div class="event__photos-container">
                      <div class="event__photos-tape">
                       ${photoItem.join('')}
                      </div>
                    </div>`;
};

const createEditFormTemplate = (point, types, destination, destinations, offersByType) => {
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
${createTypeList(types)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${point.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" 
          value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
${createDestinationField(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDatetimeFormat(point.dateFrom, DateFormat.BRITAIN)}">
          —
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDatetimeFormat(point.dateTo, DateFormat.BRITAIN)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
${createOffersSection(point.offers, offersByType)}
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
          ${createPhotoContainer(destination.pictures)}
        </section>
      </section>
    </form>
  </li>
`
  );
};

export default class EditFormView extends AbstractView {
  #point = null;
  #offersByType = null;
  #destinations = null;
  #hendleDemoClick;
  #handleFormSubmit;
  #types;

  constructor (point, types, offersByType, destinations, onDemoClick, onFormSubmit) {
    super();
    this.#point = point;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#hendleDemoClick = onDemoClick;
    this.#types = types;
    this.#handleFormSubmit = onFormSubmit;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#clickDemoHendler);


    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    const pointDestination = this.#destinations.find((dest) => dest.id === this.#point.destination);
    return createEditFormTemplate(
      this.#point,
      this.#types,
      pointDestination,
      this.#destinations,
      this.#offersByType
    );
  }

  #clickDemoHendler = (evt) => {
    evt.preventDefault();
    this.#hendleDemoClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

}
