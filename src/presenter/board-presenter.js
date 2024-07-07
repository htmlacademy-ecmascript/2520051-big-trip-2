import {render, replace} from '../framework/render.js';
import TripTableView from '../view/trip-table-view.js';
import PointView from '../view/trip-point-view.js';
// import NewPointFormView from '../view/adding-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import SortMenuView from '../view/sorting-view.js';
import { RenderPosition } from '../constants.js';


export default class TripTablePresenter {
  #tableComponent = new TripTableView();

  #boardContainer = null;
  #hTittle = null;
  #offersModel = null;
  #destinationModel = null;
  #pointsModel = null;
  #types = null;


  constructor(boardContainer, hTittle, models) {
    this.#boardContainer = boardContainer;
    this.#hTittle = hTittle;
    this.#offersModel = models.offers;
    this.#destinationModel = models.destination;
    this.#pointsModel = models.points;
    this.#types = this.#offersModel.types;
  }


  init() {
    render(this.#tableComponent, this.#boardContainer);
    render(new SortMenuView(), this.#hTittle, RenderPosition.AFTEREND);
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
