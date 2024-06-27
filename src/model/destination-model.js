import { destinations } from '../mocks/destinations.js';


export default class DestinationsModel {
  destinations = destinations;

  getAll() {
    return this.destinations;
  }
}
