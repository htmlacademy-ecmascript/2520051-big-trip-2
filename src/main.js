import TripTablePresenter from './presenter/board-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destination-model.js';
import PointsModel from './model/points-model.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-events');
const hTittleElement = siteHeaderElement.querySelector('h2');
const headerElement = document.querySelector('.trip-main');
const filterControlElement = headerElement.querySelector('.trip-controls__filters');

const models = {
  offers: new OffersModel(),
  destination: new DestinationsModel(),
  points: new PointsModel()
}

const headerPresenter = new HeaderPresenter({
  container: headerElement, 
  filterConteiner: filterControlElement
});
const tripTablePresenter = new TripTablePresenter(siteHeaderElement, hTittleElement, models);


tripTablePresenter.init();
headerPresenter.init();

