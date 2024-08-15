import Observable from '../framework/observable.js';
import { pointsData } from '../mocks/points.js';
import { Filter } from '../constants.js';
import dayjs from 'dayjs';


export default class PointsModel extends Observable {
  #points = pointsData;
  #dataFilter = null;

  set dataFilter(filter) {
    this.#dataFilter = filter;
  }

  get points() {
    switch (this.#dataFilter){
      case Filter.FUTURE:
        return this.#points.filter((point) => dayjs().isBefore(point.dateFrom, 'day'))
      case Filter.PRESENT:
        return this.#points.filter((point) => dayjs().isSame(point.dateFrom, 'day'))
      case Filter.PAST:
        return this.#points.filter((point) => dayjs().isAfter(point.dateFrom, 'day'))
      default:
        return this.#points;
      }

  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
