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

  #handleDataChange = null;
  #handleModeChange = null;

  constructor (offersModel, destinationModel, tableElement, onDataChange, onModeChange) {
    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;
    this.#tableElement = tableElement;
    this.#types = this.#offersModel.types;
    this.#destinations = this.#destinationModel.destinations;

    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;

  }

  init(point) {
    this.#point = point;

    const offersAll = this.#offersModel.offers;
    const destination = this.#destinationModel.getDestinationById(point.destination);

    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#editComponent;

    this.#pointComponent = new PointView(
      this.#point,
      offersAll,
      destination,
      () => {
        this.#replacePointToEdit();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      this.#handleFavoriteClick
    );

    this.#editComponent = new EditFormView(
      this.#point,
      this.#types,
      this.#offersModel,
      this.#destinations,
      this.#handleDemoClick,
      this.#handleFormSubmit
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
      this.#editComponent.reset(this.#point);
      this.#replaceEditToPoint();
    }
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceEditToPoint();
  };

  #handleDemoClick = () => {
    this.#editComponent.reset(this.#point);
    this.#replaceEditToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #replaceEditToPoint () {
    replace(this.#pointComponent, this.#editComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #replacePointToEdit () {
    replace(this.#editComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editComponent.reset(this.#point);
      this.#replaceEditToPoint();
    }
  };

  destroy () {
    remove(this.#pointComponent);
    remove(this.#editComponent);
  }
}
