import { offers } from '../mocks/offers.js';


export default class OffersModel {
  #offers = offers;

  get offers () {
    return this.#offers;
  }

  getOffersByType (type) {
    return this.#offers.find((offer) => offer.type === type);
  }

  get types () {

    return this.#offers.map((offer) => offer.type);
  }
}
