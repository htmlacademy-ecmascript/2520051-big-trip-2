import TripTablePresenter from './presenter/board-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-events');
const hTittleElement = siteHeaderElement.querySelector('h2');
const headerElement = document.querySelector('.trip-main');
const filterControlElement = headerElement.querySelector('.trip-controls__filters');
const headerPresenter = new HeaderPresenter({container: headerElement, filterConteiner: filterControlElement});
const tripTablePresenter = new TripTablePresenter({boardContainer: siteHeaderElement, hTittle: hTittleElement});


tripTablePresenter.init();
headerPresenter.init();
