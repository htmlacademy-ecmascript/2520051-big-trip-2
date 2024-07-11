import TripTablePresenter from './presenter/board-presenter.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destination-model.js';
import PointsModel from './model/points-model.js';


const models = {
  offers: new OffersModel(),
  destination: new DestinationsModel(),
  points: new PointsModel()
};

const tripTablePresenter = new TripTablePresenter(models);


tripTablePresenter.init();

