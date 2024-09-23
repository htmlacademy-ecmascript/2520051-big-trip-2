import Observable from '../framework/observable.js';
import { UpdateType } from '../constants.js';


export default class OffersModel extends Observable {
  #offers;
  #offersApiService = null;

  constructor(offersApiService) {
    super();
    this.#offersApiService = offersApiService;
  }

  get offers () {
    return this.#offers;
  }

  getOffersByType (type) {
    return this.#offers.find((offer) => offer.type === type);
  }

  get types () {
    return this.#offers.map((offer) => offer.type);
  }

  async init() {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers;
    } catch(err) {
      this.#offers = [];
    }
    this._notify(UpdateType.INIT);
  }

  updateOffer(updateType, update) {
    const index = this.#offers.findIndex((offer) => offer.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting offer');
    }

    this.#offers = [
      ...this.#offers.slice(0, index),
      update,
      ...this.#offers.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addOffer(updateType, update) {
    this.#offers = [
      update,
      ...this.#offers,
    ];

    this._notify(updateType, update);
  }

  deleteOffer(updateType, update) {
    const index = this.#offers.findIndex((offer) => offer.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting offer');
    }

    this.#offers = [
      ...this.#offers.slice(0, index),
      ...this.#offers.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
