import {render, remove} from '../framework/render.js';
import TripTableView from '../view/trip-table-view.js';
import { DataStatus } from '../constants.js';

import SortMenuView from '../view/sorting-view.js';
import FilterFormView from '../view/filters-view.js';
import EmptyTableView from '../view/empty-table-view.js';
import LoadingView from '../view/loading-view.js';

import { RenderPosition } from '../constants.js';

import InfoPresenter from './info-presenter.js';
import PointPresenter from './point-presenter.js';
import { sortByTime } from '../utils.js';

import { SortType, UpdateType, UserAction, Filter, Mode } from '../constants.js';

import NewPointButtonView from '../view/new-point-button-view.js';
import EditFormView from '../view/edit-form-view.js';


export default class TripTablePresenter {
  #tableComponent = new TripTableView();
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
  #loadingComponent = new LoadingView();
  #newPointButton = null;

  #isLoading = 3;

  constructor(models) {
    this.#offersModel = models.offers;
    this.#destinationModel = models.destination;
    this.#pointsModel = models.points;
    this.#destinationModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
  this.#renderBoard();
  this.#offersModel.init(),
  this.#destinationModel.init(),
  this.#pointsModel.init()
  }

  #getPoints() {

    this.#pointsModel.dataFilter = this.#currentFilter;

    switch (this.#currentSortType) {
      case SortType.TIME:
        return this.#sortByTime();
      case SortType.PRICE:
        return this.#sortByPrice();
      default:
        return this.#pointsModel.points;
    }
  }

  #renderBoard() {
    this.#boardContainer = document.querySelector('.trip-events');
    this.#headerElement = document.querySelector('.trip-main');
    const filterControlElement = this.#headerElement.querySelector('.trip-controls__filters');
    if(this.#filterComponent === null) {
      this.#filterComponent = new FilterFormView(this.#currentFilter, this.#handleFilterChange);
      render(this.#filterComponent, filterControlElement);
    }
    if(this.#newPointButton === null){
      this.#renderNewPointButton();
    }
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#points = this.#getPoints();
    
    this.#renderEmpty();
    if(this.#noPointsComponent === null){
      this.#renderList();
      
    }
  }
  #clearBoard(resetSortType = false) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#removeNewForm();
    remove(this.#noPointsComponent);
    remove(this.#loadingComponent);
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

  }
  #renderList() {
    if(this.#sortComponent === null){
      this.#sortComponent = new SortMenuView(this.#currentSortType, this.#handleSortTypeChange);
      this.#renderSorting();
    }
    if(this.#infoPresenter === null){
      this.#infoPresenter = new InfoPresenter();
      this.#infoPresenter.init(this.#headerElement);
    }
    this.#renderPoints(this.#points);
  }
  #renderEmpty() {
    this.#noPointsComponent = null;
    if (this.#points === undefined) {
      this.#noPointsComponent = new EmptyTableView(DataStatus.ERROR);
    }
    else if (!this.#points.length) {
      this.#noPointsComponent = new EmptyTableView(DataStatus.EMPTY);
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
  #handleFilterChange() {

  }
  
  #handleNewPointButtonClick = () => {
    this.#newPointPresenter = new PointPresenter(
      this.#offersModel,
      this.#destinationModel,
      this.#tableComponent.element,
      this.#handleViewAction,
      this.#handleModeChange,
      Mode.ADDING
    )
    const point = {
      id: '',
      type: 'flight',
      base_price: 0,
      date_from: new Date(), 
      date_to: new Date(), 
      destination: '', 
      is_favorite: false,
      offers: []
    }
    this.#newPointButton.element.disabled = true;
    this.#newPointPresenter.init(point)
  }

  #sortByPrice = () => [...this.#pointsModel.points].sort((a, b) => b.basePrice - a.basePrice);

  #sortByTime = () => [...this.#pointsModel.points].sort((a, b) => sortByTime(a, b));

  #removeNewForm = () => {

    if(this.#newPointPresenter === null){
      return;
    }
    this.#newPointPresenter.resetView();
    this.#newPointButton.element.disabled = false;
    this.#newPointPresenter = null;
  }
  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#removeNewForm();
    
  };
  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#points = this.#getPoints();
    this.#renderList();
  };

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
