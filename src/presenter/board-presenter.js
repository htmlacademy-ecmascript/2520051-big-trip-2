import {render, remove} from '../framework/render.js';
import dayjs from 'dayjs';

import TripTableView from '../view/trip-table-view.js';
import { DataStatus, RenderPosition, SortType, UpdateType, UserAction, Filter, Mode } from '../constants.js';

import SortingView from '../view/sorting-view.js';
import FiltersView from '../view/filters-view.js';
import EmptyTableView from '../view/empty-table-view.js';
import LoadingView from '../view/loading-view.js';

import InfoPresenter from './info-presenter.js';
import PointPresenter from './point-presenter.js';
import { sortByTime, sortByDay } from '../utils.js';

import NewPointButtonView from '../view/new-point-button-view.js';


export default class TripTablePresenter {
  #tableComponent = null;
  #boardContainer = null;
  #headerElement = null;
  #infoPresenter = null;

  #offersModel;
  #destinationModel;
  #pointsModel;

  #points = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #currentFilter = Filter.DEFAULT;
  #filterComponent = null;
  #noPointsComponent = null;
  #sortComponent = null;
  #emptyStatus = null;
  #loadingComponent = new LoadingView();
  #newPointButton = null;

  #isLoading;
  #filterMap = {
    everything: false,
    future: false,
    present: false,
    past: false
  };

  constructor(models) {
    this.#offersModel = models.offers;
    this.#destinationModel = models.destination;
    this.#pointsModel = models.points;
    this.#isLoading = Object.keys(models).length;
    this.#destinationModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
    this.#offersModel.init();
    this.#destinationModel.init();
    this.#pointsModel.init();
  }

  #getPoints() {
    this.#points = this.#pointsModel.getPoints();
    if (this.#points === null) {
      this.#emptyStatus = DataStatus.ERROR;
      return null;
    }
    if (!this.#points.length) {
      this.#emptyStatus = DataStatus.EMPTY;
      return 0;
    }
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#pointsModel.getPoints(this.#currentFilter)].sort((a, b) => sortByTime(a, b));
      case SortType.PRICE:
        return [...this.#pointsModel.getPoints(this.#currentFilter)].sort((a, b) => b.basePrice - a.basePrice);
      default:
        return [...this.#pointsModel.getPoints(this.#currentFilter)].sort((a, b) => sortByDay(a, b));
    }
  }

  #renderBoard() {
    this.#boardContainer = document.querySelector('.trip-events');
    this.#headerElement = document.querySelector('.trip-main');
    const filterControlElement = this.#headerElement.querySelector('.trip-controls__filters');
    this.#emptyStatus = null;

    if(this.#newPointButton === null){
      this.#renderNewPointButton();
    }
    if (this.#isLoading) {
      this.#renderLoading();
    } else {
      this.#points = this.#getPoints();
      remove(this.#filterComponent);
      this.#filterComponent = null;
      if(this.#currentFilter === Filter.PAST && !this.#points.length){
        this.#emptyStatus = DataStatus.PAST_EMPTY;
      }
      if(this.#currentFilter === Filter.PRESENT && !this.#points.length){
        this.#emptyStatus = DataStatus.FUTURE_EMPTY;
      }
      if(this.#currentFilter === Filter.FUTURE && !this.#points.length){
        this.#emptyStatus = DataStatus.FUTURE_EMPTY;
      }
      if (this.#emptyStatus !== null){
        this.#renderEmpty(this.#emptyStatus);
      } else {
        this.#newPointButton.element.disabled = false;
        if(this.#infoPresenter === null){
          this.#infoPresenter = new InfoPresenter(this.#pointsModel, this.#destinationModel, this.#offersModel);
          this.#infoPresenter.init(this.#headerElement);
        }
        this.#getFilterMap();
        this.#renderList();
      }
    }
    if (this.#filterComponent === null) {
      this.#filterComponent = new FiltersView(this.#currentFilter, this.#handleFilterChange, this.#filterMap);
      render(this.#filterComponent, filterControlElement);
    }
  }

  #getFilterMap() {
    const points = this.#pointsModel.getPoints();
    this.#filterMap.everything = true;
    this.#filterMap.present = points.some((point) => dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));
    this.#filterMap.past = points.some((point) => dayjs().isAfter(point.dateTo));
    this.#filterMap.future = points.some((point) => dayjs().isBefore(point.dateFrom));
  }

  #clearBoard(resetSortType = false, resetInfo = true) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#removeNewForm();
    remove(this.#noPointsComponent);
    remove(this.#loadingComponent);
    if(resetInfo && this.#infoPresenter !== null) {
      this.#infoPresenter.removeView();
      this.#infoPresenter = null;
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

  }

  #renderList() {
    if(this.#sortComponent === null){
      this.#sortComponent = new SortingView(this.#currentSortType, this.#handleSortTypeChange);
      this.#renderSorting();
    }
    this.#renderPoints(this.#points);
  }

  #renderEmpty() {
    if(this.#emptyStatus === DataStatus.ERROR) {
      this.#newPointButton.element.disabled = true;
      this.#noPointsComponent = new EmptyTableView(DataStatus.ERROR);
    } else if (this.#emptyStatus === DataStatus.EMPTY) {
      this.#newPointButton.element.disabled = false;
      this.#filterMap.everything = true;
      this.#noPointsComponent = new EmptyTableView(DataStatus.EMPTY);
    } else if (this.#emptyStatus !== null) {
      this.#noPointsComponent = new EmptyTableView(this.#emptyStatus);
      if(this.#infoPresenter === null){
        this.#infoPresenter = new InfoPresenter(this.#pointsModel, this.#destinationModel, this.#offersModel);
        this.#infoPresenter.init(this.#headerElement);
      }
    }
    if(this.#noPointsComponent !== null) {
      remove(this.#sortComponent);
      render (this.#noPointsComponent, this.#boardContainer);
    }
  }

  #renderSorting() {
    const tittleElement = this.#boardContainer.querySelector('h2');
    render(this.#sortComponent, tittleElement, RenderPosition.AFTEREND);
  }

  #renderPoints (points) {
    if (this.#tableComponent === null){
      this.#tableComponent = new TripTableView();
    }
    render(this.#tableComponent, this.#boardContainer);
    points.forEach((point) => {
      this.#renderPoint(
        point
      );
    });
  }

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


  #renderLoading() {
    this.#newPointButton.element.disabled = true;
    this.#loadingComponent = new EmptyTableView(DataStatus.LOADING);
    render (this.#loadingComponent, this.#boardContainer);

  }

  #renderNewPointButton() {
    const siteHeaderElement = document.querySelector('.trip-main');
    this.#newPointButton = new NewPointButtonView(
      this.#handleNewPointButtonClick
    );
    render(this.#newPointButton, siteHeaderElement);

  }

  #handleFilterChange = (filter) => {
    if (this.#currentFilter === filter) {
      return;
    }
    this.#currentFilter = filter;
    this.#clearBoard(true, true);
    this.#renderBoard();
  };

  #handleNewPointButtonClick = () => {
    this.#currentFilter = Filter.DEFAULT;
    this.#clearBoard(true, true);
    this.#renderBoard();
    if (this.#tableComponent === null) {
      remove(this.#noPointsComponent);
      this.#tableComponent = new TripTableView();
      render(this.#tableComponent, this.#boardContainer);
    }
    this.#newPointPresenter = new PointPresenter(
      this.#offersModel,
      this.#destinationModel,
      this.#tableComponent.element,
      this.#handleViewAction,
      this.#handleModeChange,
      Mode.ADDING
    );
    const point = {
      type: 'flight',
      basePrice: 0,
      dateFrom: '',
      dateTo: '',
      destination: '',
      isFavorite: false,
      offers: []
    };
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointButton.element.disabled = true;
    this.#newPointPresenter.init(point);

  };

  #removeNewForm = () => {
    if(this.#newPointPresenter === null){
      return;
    }
    this.#newPointPresenter.resetView();
    this.#newPointButton.element.disabled = false;
    this.#newPointPresenter = null;
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#removeNewForm();

  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard(false, false);
    this.#points = this.#getPoints();
    this.#renderList();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.WITHOUT_FORM:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting(false);
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard(false, true);
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(true, true);
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading--;
        if (!this.#isLoading){
          this.#clearBoard();
          this.#renderBoard();
        }
        break;
    }
  };
}
