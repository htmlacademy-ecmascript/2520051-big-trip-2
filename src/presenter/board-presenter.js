import {render, replace} from '../framework/render.js';
import TripTableView from '../view/trip-table-view.js';
import PointView from '../view/trip-point-view.js';
// import NewPointFormView from '../view/adding-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import SortMenuView from '../view/sorting-view.js';
import { RenderPosition, DataStatus } from '../constants.js';

import InfoView from '../view/trip-info-view.js';
import FilterFormView from '../view/filters-view.js';
import EmptyTableView from '../view/empty-table-view.js';


export default class TripTablePresenter {
  #tableComponent = new TripTableView();

  #offersModel = null;
  #destinationModel = null;
  #pointsModel = null;
  #types = null;


  constructor(models) {
    this.#offersModel = models.offers;
    this.#destinationModel = models.destination;
    this.#pointsModel = models.points;
    this.#types = this.#offersModel.types;
  }

  init() {
    const boardContainer = document.querySelector('.trip-events');
    const hTittle = boardContainer.querySelector('h2');
    const headerElement = document.querySelector('.trip-main');
    const filterControlElement = headerElement.querySelector('.trip-controls__filters');

    render(new FilterFormView(), filterControlElement);
    if (this.#pointsModel.points === undefined) {
      render(new EmptyTableView(DataStatus.ERROR), boardContainer);
      return;
    }
    if (!this.#pointsModel.points.length) {
      render(new EmptyTableView(DataStatus.EMPTY), boardContainer);
      return;
    }
    render(new InfoView(), headerElement, RenderPosition.AFTERBEGIN);
    render(this.#tableComponent, boardContainer);
    render(new SortMenuView(), hTittle, RenderPosition.AFTEREND);
    // render(new NewPointFormView(destinations, offersAll), this.#tableComponent.element, RenderPosition.AFTERBEGIN);
    this.#pointsModel.points.forEach((point) => {
      this.#renderPoint(
        point
      );
    });
  }

  #renderPoint(point) {
    const offersAll = this.#offersModel.offers;
    const destination = this.#destinationModel.getDestinationById(point.destination);
    const offersByType = this.#offersModel.getOffersByType(point.type);

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView(
      point,
      offersAll,
      destination,
      () => {
        replacePointToEdit();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    );
    const editComponent = new EditFormView(
      point,
      this.#types,
      offersByType.offers,
      this.#destinationModel.destinations,
      () => {
        replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      () => {
        replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    );

    function replaceEditToPoint () {
      replace(pointComponent, editComponent);
    }

    function replacePointToEdit () {
      replace(editComponent, pointComponent);
    }

    render(pointComponent, this.#tableComponent.element);
  }
}
