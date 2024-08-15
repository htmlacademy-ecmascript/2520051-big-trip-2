import {render} from '../framework/render.js';
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
  // #boardTrip = [];
  // #sourcedBoardTasks = [];
  #currentSortType = SortType.DEFAULT;
  #currentFilter = Filter.DEFAULT;

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
    const tittleElement = this.#boardContainer.querySelector('h2');

    const infoPresenter = new InfoPresenter();
    infoPresenter.init(this.#headerElement);
    
    render(new FilterFormView(this.#currentFilter), filterControlElement);
    render(new SortMenuView(this.#currentSortType, this.#handleSortTypeChange), tittleElement, RenderPosition.AFTEREND);

    this.#renderBoard();


  }

  #handleFilterChange = (filter) => {
    if (this.#currentFilter === filter) {
      return;
    }

    this.#currentFilter = filter;
    this.#clearBoard();
    this.#renderPoints(this.points);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderPoints(this.points);
  };

  #sortByPrice = () => {
    return [...this.#pointsModel.points].sort((a, b) => b.basePrice - a.basePrice);
  };

  #sortByTime = () => {
    return [...this.#pointsModel.points].sort((a, b) => sortByTime(a, b));
  };

  #clearBoard(resetSortType = false) {
    // const taskCount = this.tasks.length;

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    // remove(this.#sortComponent);
    // remove(this.#noTaskComponent);
    // remove(this.#loadMoreButtonComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard() {

    if (this.points === undefined) {
      render(new EmptyTableView(DataStatus.ERROR), this.#boardContainer);
      return;
    }
    if (!this.points.length) {
      render(new EmptyTableView(DataStatus.EMPTY), this.#boardContainer);
      return;
    }

    this.#renderPoints(this.points);
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
    console.log('PointPresenter');
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
    
    // this.#boardTrip = updateItem(this.#boardTrip, updatedTask);
    // this.#sourcedBoardTasks = updateItem(this.#sourcedBoardTasks, updatedTask);
    // this.#pointPresenters.get(updatedTask.id).init(updatedTask);
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
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
