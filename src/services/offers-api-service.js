import ApiService from '../framework/api-service.js';
import { Url } from '../constants.js';

export default class OffersApiService extends ApiService {
  get offers() {
    return this._load({url: Url.OFFERS})
      .then(ApiService.parseResponse);
  }
}

