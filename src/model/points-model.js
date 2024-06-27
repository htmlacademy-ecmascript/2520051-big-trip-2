import { pointsData } from '../mocks/points.js';


export default class PointsModel {
  points = pointsData;

  getAll() {
    return this.points;
  }
}
