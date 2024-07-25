import {render} from '../framework/render.js';
import TripTableView from '../view/trip-table-view.js';
import { DataStatus } from '../constants.js';

import SortMenuView from '../view/sorting-view.js';
import FilterFormView from '../view/filters-view.js';
import EmptyTableView from '../view/empty-table-view.js';

import { RenderPosition } from '../constants.js';

import InfoPresenter from './info-presenter.js';
import PointPresenter from './point-presenter.js';
import { updateItem, sortByTime } from '../utils.js';

import { SortType } from '../constants.js';


export default class TripTablePresenter {
  #tableComponent = new TripTableView();
  #boardContainer = null;
  #headerElement = null;

  #offersModel = null;
  #destinationModel = null;
  #pointsModel = null;

  #pointPresenters = new Map();
  #boardTrip = [];
  #sourcedBoardTasks = [];
  #currentSortType = SortType.DEFAULT;

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

    this.#sourcedBoardTasks = [...this.#pointsModel.points];

  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);
    this.#clearBoard();
    this.#renderPoints();
  };

  #sortByPrice = () => {
    this.#boardTrip.sort((a, b) => b.basePrice - a.basePrice);
  };

  #sortByTime = () => {
    this.#boardTrip.sort((a, b) => sortByTime(a, b));
  };

  #sortTasks(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks

    switch (sortType) {
      case SortType.TIME:
        this.#sortByTime();
        break;
      case SortType.PRICE:
        this.#sortByPrice();
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this.#boardTrip = [...this.#sourcedBoardTasks];
    }
    this.#currentSortType = sortType;
  }

  #renderBoard() {

    const hTittle = this.#boardContainer.querySelector('h2');

    const infoPresenter = new InfoPresenter();
    infoPresenter.init(this.#headerElement);

    render(new SortMenuView(this.#handleSortTypeChange), hTittle, RenderPosition.AFTEREND);


    this.#renderPoints();
  }

  #renderPoints () {
    render(this.#tableComponent, this.#boardContainer);
    this.#boardTrip.forEach((point) => {
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
    this.#sourcedBoardTasks = updateItem(this.#sourcedBoardTasks, updatedTask);
    this.#pointPresenters.get(updatedTask.id).init(updatedTask);
  };

  #clearBoard() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

}
