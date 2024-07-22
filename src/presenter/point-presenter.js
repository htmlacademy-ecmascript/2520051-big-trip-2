import {render, replace, remove} from '../framework/render.js';

import PointView from '../view/trip-point-view.js';
import EditFormView from '../view/edit-form-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #offersModel = null;
  #destinationModel = null;

  #tableElement = null;
  #types = null;
  #destinations = null;

  #pointComponent = null;
  #editComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  #handleFavoriteChange = null;
  #handleModeChange = null;

  constructor (offersModel, destinationModel, tableElement, onDataChange, onModeChange) {
    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;
    this.#tableElement = tableElement;
    this.#types = this.#offersModel.types;
    this.#destinations = this.#destinationModel.destinations;

    this.#handleFavoriteChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const offersAll = this.#offersModel.offers;
    const destination = this.#destinationModel.getDestinationById(point.destination);
    const offersByType = this.#offersModel.getOffersByType(point.type);

    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#editComponent;

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.#replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    this.#pointComponent = new PointView(
      this.#point,
      offersAll,
      destination,
      () => {
        this.#replacePointToEdit();
        document.addEventListener('keydown', escKeyDownHandler);
      },
      this.#handleFavoriteClick
    );

    this.#editComponent = new EditFormView(
      this.#point,
      this.#types,
      offersByType.offers,
      this.#destinations,
      () => {
        this.#replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      () => {
        this.#replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    );

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#pointComponent, this.#tableElement);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editComponent, prevEditComponent);
    }
    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditToPoint();
    }
  }

  #handleFavoriteClick = () => {
    this.#handleFavoriteChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #replaceEditToPoint () {
    replace(this.#pointComponent, this.#editComponent);
    this.#mode = Mode.DEFAULT;
  }

  #replacePointToEdit () {
    replace(this.#editComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  destroy () {
    remove(this.#pointComponent);
    remove(this.#editComponent);
  }
}
