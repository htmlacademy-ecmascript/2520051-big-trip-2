import AbstractView from '../framework/view/abstract-view.js';
import { DateFormat } from '../constants.js';
import { getDatetimeFormat } from '../utils.js';
import dayjs from 'dayjs';

function createTripInfoDates (dateFrom, dateTo) {
  if(dayjs(dateFrom).isSame(dateTo, 'month')){
    return (`${getDatetimeFormat(dateFrom, DateFormat.DAY)}&nbsp;—&nbsp;${getDatetimeFormat(dateTo, DateFormat.HUMAN_)}`);
  }
  return (`${getDatetimeFormat(dateFrom, DateFormat.HUMAN_)}&nbsp;—&nbsp;${getDatetimeFormat(dateTo, DateFormat.HUMAN_)}`);
}

function createInfoTemplate(totalPrice, dateFrom, dateTo, route) {
  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${route.join(' — ')}</h1>

      <p class="trip-info__dates">${createTripInfoDates(dateFrom, dateTo)}</p>
    </div>

    <p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>
`
  );
}

export default class TripInfoView extends AbstractView {
  #totalPrice;
  #dateFrom;
  #dateTo;
  #route;

  constructor(totalPrice, route, dateFrom, dateTo){
    super();
    this.#totalPrice = totalPrice;
    this.#dateFrom = dateFrom;
    this.#dateTo = dateTo;
    this.#route = route;
  }

  get template() {
    return createInfoTemplate(this.#totalPrice, this.#dateFrom, this.#dateTo, this.#route);
  }
}
