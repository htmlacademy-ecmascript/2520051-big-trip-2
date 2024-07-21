import {render} from '../framework/render.js';
import TripTableView from '../view/trip-table-view.js';
import { DataStatus } from '../constants.js';

import FilterFormView from '../view/filters-view.js';
import EmptyTableView from '../view/empty-table-view.js';
import InfoPresenter from './info-presenter.js';
import SortPresenter from './sort-presenter.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';


export default class TripTablePresenter {
  #tableComponent = new TripTableView();
  #boardContainer = null;
  #headerElement = null;

  #offersModel = null;
  #destinationModel = null;
  #pointsModel = null;

  #pointPresenters = new Map();
  #boardTrip = [];

  constructor(models) {
    this.#offersModel = models.offers;
    this.#destinationModel = models.destination;
    this.#pointsModel = models.points;
  }

  init() {
    this.#boardContainer = document.querySelector('.trip-events');
    this.#headerElement = document.querySelector('.trip-main');
    const filterControlElement = this.#headerElement.querySelector('.trip-controls__filters');

    render(new FilterFormView(), filterControlElement);
    if (this.#pointsModel.points === undefined) {
      render(new EmptyTableView(DataStatus.ERROR), this.#boardContainer);
      return;
    }
    if (!this.#pointsModel.points.length) {
      render(new EmptyTableView(DataStatus.EMPTY), this.#boardContainer);
      return;
    }

    this.#boardTrip = [...this.#pointsModel.points];
    this.#renderBoard();

  }

  #renderBoard() {

    const hTittle = this.#boardContainer.querySelector('h2');

    const sortPresenter = new SortPresenter();
    const infoPresenter = new InfoPresenter();

    infoPresenter.init(this.#headerElement);
    sortPresenter.init(hTittle);

    this.#renderPoints();
  }

  #renderPoints () {
    render(this.#tableComponent, this.#boardContainer);
    this.#pointsModel.points.forEach((point) => {
      this.#renderPoint(
        point
      );
    });
  }


  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoint(point) {

    const pointPresenter = new PointPresenter(
      this.#offersModel,
      this.#destinationModel,
      this.#tableComponent.element,
      this.#handleTaskChange,
      this.#handleModeChange
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleTaskChange = (updatedTask) => {
    this.#boardTrip = updateItem(this.#boardTrip, updatedTask);
    this.#pointPresenters.get(updatedTask.id).init(updatedTask);
  };

  #clearBoard() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
