import Observable from '../framework/observable.js';
import { UpdateType } from '../constants.js';


export default class DestinationsModel extends Observable {
  #destinations;
  #destinationsApiService = null;

  constructor(destinationsApiService) {
    super();
    this.#destinationsApiService = destinationsApiService;

    this.#destinationsApiService.destinations.then((destinations) => {
      console.log(destinations);
    });
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const destinations = await this.#destinationsApiService.destinations;
      this.#destinations = destinations;
    } catch(err) {
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT);
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
