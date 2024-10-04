import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { DateFormat } from '../constants.js';
import { getDatetimeFormat } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createOfferItem = (pointOffers, offers) => {
  const listItems = [];
  for (const offer of offers) {
    const isChecked = pointOffers.includes(offer.id);
    listItems.push(
      `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage" ${isChecked ? 'checked=""' : ''}>
    <label class="event__offer-label" for="${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      +€&nbsp;
      <span class="event__offer-price">${offer.price}</span>
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
  if (!offersByType.length) {
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
      `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
    );
  });
  return `<div class="event__photos-container">
                      <div class="event__photos-tape">
                       ${photoItem.join('')}
                      </div>
                    </div>`;
};

const createDestinationSection = (destination) =>
  `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${destination.description}</p>
  ${createPhotoContainer(destination.pictures)}
</section>`;


const createEditFormTemplate = (point, types, destination, destinations, offersByType) => {
  console.log(point);
  const isDisabled = point.isDisabled ? point.isDisabled : '';
  const isSaving = point.isSaving ? point.isSaving : '';
  const isDeleting = point.isDeleting ? point.isDeleting : '';
  
  return `<li class="trip-events__item">
    <form class="event event--edit ${point.id ? '' : 'event--edit-new'}" action="#" method="post">
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
          value="${destination ? destination.name : ''}" list="destination-list-1">
          <datalist id="destination-list-1">
${createDestinationField(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${point.dateFrom ? getDatetimeFormat(point.dateFrom, DateFormat.BRITAIN) : ''}">
          —
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${point.dateTo ? getDatetimeFormat(point.dateTo, DateFormat.BRITAIN) : ''}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice ? point.basePrice : ''}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit"  ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${point.id ? (isDeleting ? 'Deleting...' : 'Delete') : 'Cancel'}</button>
          ${ point.id ?
    `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : ''}

      </header>
      <section class="event__details">
        ${createOffersSection(point.offers, offersByType)}

        ${destination ? (destination.description ? createDestinationSection(destination) : '') : ''}
      </section>
    </form>
  </li>
`;
          }

export default class EditFormView extends AbstractStatefulView {
  #point = null;
  #offersModel = null;
  #offersByType = null;
  #destinations = null;
  #hendleDemoClick;
  #handleFormSubmit;
  #types;
  #prevDestination = null;
  #dateFromPickr = null;
  #dateToPickr = null;
  #handleDeleteClick = null;


  constructor (point, offersModel, destinations, onDemoClick, onFormSubmit, onDeleteClick) {
    super();
    this.#point = point;
    this.#offersModel = offersModel;
    this.#destinations = destinations;
    this.#hendleDemoClick = onDemoClick;
    this.#types = this.#offersModel.types;
    this.#handleFormSubmit = onFormSubmit;

    this.#handleDeleteClick = onDeleteClick;

    this._setState(this.#point);
    this._restoreHandlers();
  }

  get template() {
    const pointDestination = this.#destinations.find((dest) => dest.id === this._state.destination);
    this.#offersByType = this.#offersModel.getOffersByType(this._state.type).offers;
    return createEditFormTemplate(
      this._state,
      this.#types,
      pointDestination,
      this.#destinations,
      this.#offersByType,
    );
  }

  _restoreHandlers = () => {
    const rollupElement = this.element.querySelector('.event__rollup-btn');
    if(rollupElement) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#clickDemoHendler);
    }


    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__type-list')
      .addEventListener('click', this.#typeChangeHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    const eventOfferLuggage = this.element.querySelectorAll('[name=event-offer-luggage]');
    eventOfferLuggage.forEach((elem) =>
      elem.addEventListener('change', () =>
        this.updateElement({...this._state,
          offers: Array.from(eventOfferLuggage).filter((chb)=>chb.checked).map((chb)=>chb.id)
        })
      )
    );

    this.element.querySelector('#event-destination-1').addEventListener('focus', (evt) => {
      this.#prevDestination = evt.target.value;
      evt.target.value = '';
    });

    this.element.querySelector('#event-destination-1').addEventListener('blur', (evt) => {
      if (this.#destinations.find((elem) => evt.target.value === elem.name)){
        return;
      }
      evt.target.value = this.#prevDestination;
    });

    this.element.querySelector('#event-destination-1').addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change',
      (evt) => {
        this.updateElement({...this._state, basePrice: +evt.target.value});
      }
    );

    this.#setDatePicker();
  };

  #clickDemoHendler = () => {
    this.#hendleDemoClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state);
  };

  #typeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.updateElement({...this._state, type: evt.target.value, offers: []}); // добавить проверку, изменился ли тип
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((elem) => evt.target.value === elem.name);
    if (selectedDestination){
      this.updateElement({...this._state, destination: selectedDestination.id});
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      ...this._state,
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      ...this._state,
      dateTo: userDate,
    });
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this._state);
  };

  removeElement() {
    super.removeElement();

    if (this.#dateFromPickr) {
      this.#dateFromPickr.destroy();
      this.#dateFromPickr = null;
    }
    if (this.#dateToPickr) {
      this.#dateToPickr.destroy();
      this.#dateToPickr = null;
    }
  }

  #setDatePicker() {
    this.#dateFromPickr = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onClose: this.#dateFromChangeHandler,
      },
    );
    this.#dateToPickr = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this.#dateToChangeHandler,
      },
    );
  }

  reset = (point) => this.updateElement(point);
}
