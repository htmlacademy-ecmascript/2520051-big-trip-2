import { AUTHORIZATION, END_POINT } from './constants.js';
import TripTablePresenter from './presenter/board-presenter.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destination-model.js';
import PointsModel from './model/points-model.js';
import PointsApiService from './services/points-api-service.js';
import DestinationsApiService from './services/destinations-api-service.js';
import OffersApiService from './services/offers-api-service.js';

const models = {
  offers: new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION)),
  destination: new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION)),
  points: new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION))
};

const tripTablePresenter = new TripTablePresenter(models);


tripTablePresenter.init();
