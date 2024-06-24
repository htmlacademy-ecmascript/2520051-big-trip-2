import { offers } from '../mocks/offers.js';


export default class OffersModel {
  offers = offers;

  getAll() {
    return this.offers;
  }
}