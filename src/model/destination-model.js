import Observable from '../framework/observable.js';
import { destinations } from '../mocks/destinations.js';


export default class DestinationsModel extends Observable {
  #destinations = destinations;

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  updateDestination(updateType, update) {
    const index = this.#destinations.findIndex((destination) => destination.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting destination');
    }

    this.#destinations = [
      ...this.#destinations.slice(0, index),
      update,
      ...this.#destinations.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addDestination(updateType, update) {
    this.#destinations = [
      update,
      ...this.#destinations,
    ];

    this._notify(updateType, update);
  }

  deleteDestination(updateType, update) {
    const index = this.#destinations.findIndex((destination) => destination.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting destination');
    }

    this.#destinations = [
      ...this.#destinations.slice(0, index),
      ...this.#destinations.slice(index + 1),
    ];

    this._notify(updateType);
  }

}
