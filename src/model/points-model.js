import { pointsData } from '../mocks/points.js';


export default class PointsModel {
  #points = pointsData;

  get points() {
    return this.#points;
  }
}
