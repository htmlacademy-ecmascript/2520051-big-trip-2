import {render, remove} from '../framework/render.js';
import TripTableView from '../view/trip-table-view.js';
import { DataStatus } from '../constants.js';

import SortMenuView from '../view/sorting-view.js';
import FilterFormView from '../view/filters-view.js';
import EmptyTableView from '../view/empty-table-view.js';

import { RenderPosition } from '../constants.js';

import InfoPresenter from './info-presenter.js';
import PointPresenter from './point-presenter.js';
import { sortByTime } from '../utils.js';

import { SortType, UpdateType, UserAction, Filter } from '../constants.js';


export default class TripTablePresenter {
  #tableComponent = new TripTableView();
  #boardContainer = null;
  #headerElement = null;

  #offersModel = null;
  #destinationModel = null;
  #pointsModel = null;

  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentFilter = Filter.DEFAULT;
  #noTaskComponent = null;
  #sortComponent = null;

  constructor(models) {
    this.#offersModel = models.offers;
    this.#destinationModel = models.destination;
    this.#pointsModel = models.points;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {

    this.#pointsModel.dataFilter = this.#currentFilter;

    switch (this.#currentSortType) {
      case SortType.TIME:
        return this.#sortByTime();
      case SortType.PRICE:
        return this.#sortByPrice();
    }

    return this.#pointsModel.points;
  }

  init() {
    this.#boardContainer = document.querySelector('.trip-events');
    this.#headerElement = document.querySelector('.trip-main');
    const filterControlElement = this.#headerElement.querySelector('.trip-controls__filters');

    const infoPresenter = new InfoPresenter();
    infoPresenter.init(this.#headerElement);

    render(new FilterFormView(this.#currentFilter, this.#handleFilterChange), filterControlElement);
    this.#sortComponent = new SortMenuView(this.#currentSortType, this.#handleSortTypeChange);

    this.#renderBoard();


  }

  #handleFilterChange = (filter) => {
    if (this.#currentFilter === filter) {
      return;
    }

    this.#currentFilter = filter;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderPoints(this.points);
  };

  #sortByPrice = () => [...this.#pointsModel.points].sort((a, b) => b.basePrice - a.basePrice);

  #sortByTime = () => [...this.#pointsModel.points].sort((a, b) => sortByTime(a, b));

  #clearBoard(resetSortType = false) {

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#noTaskComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard() {
    this.#noTaskComponent = null;
    if (this.points === undefined) {
      this.#noTaskComponent = new EmptyTableView(DataStatus.ERROR);
    }
    if (!this.points.length) {
      this.#noTaskComponent = new EmptyTableView(DataStatus.EMPTY);
    }

    if(this.#noTaskComponent) {
      remove(this.#sortComponent);
      render (this.#noTaskComponent, this.#boardContainer);
      return;
    }
    this.#renderSorting();
    this.#renderPoints(this.points);
  }

  #renderSorting() {
    const tittleElement = this.#boardContainer.querySelector('h2');
    render(this.#sortComponent, tittleElement, RenderPosition.AFTEREND);
  }

  #renderPoints (points) {
    render(this.#tableComponent, this.#boardContainer);
    points.forEach((point) => {
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
      this.#handleViewAction,
      this.#handleModeChange
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }

  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(true);
        this.#renderBoard();
        break;
    }
  };
}
