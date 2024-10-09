import {render, replace, remove} from '../framework/render.js';

import PointView from '../view/trip-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import {UserAction, UpdateType, RenderPosition, Mode} from '../constants.js';


export default class PointPresenter {
  #offersModel = null;
  #destinationModel = null;

  #tableElement = null;
  #destinations = null;

  #pointComponent = null;
  #editComponent = null;

  #point = null;
  #mode;
  #action;
  #handleDataChange = null;
  #handleModeChange = null;

  constructor (offersModel, destinationModel, tableElement, onDataChange, onModeChange, mode = Mode.DEFAULT) {
    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;
    this.#tableElement = tableElement;
    this.#destinations = this.#destinationModel.destinations;
    this.#mode = mode;
    this.#action = mode === Mode.ADDING ? UserAction.ADD_TASK : UserAction.UPDATE_TASK;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;

  }

  init(point) {
    this.#point = point;

    const offersAll = this.#offersModel.offers;
    const destination = this.#destinationModel.getDestinationById(point.destination);

    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#editComponent;

    if(this.#mode !== Mode.ADDING){
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
    }

    this.#editComponent = new EditFormView(
      this.#point,
      this.#offersModel,
      this.#destinations,
      this.#handleDemoClick,
      this.#handleFormSubmit,
      this.#handleDeleteClick
    );
    if (this.#mode === Mode.ADDING) {
      render(this.#editComponent, this.#tableElement, RenderPosition.AFTERBEGIN);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      return;
    }

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#pointComponent, this.#tableElement);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevEditComponent);
      this.#mode = Mode.DEFAULT;
    }
    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING || this.#mode === Mode.ADDING) {
      this.#editComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  resetView() {
    if (this.#mode === Mode.ADDING) {
      remove(this.#editComponent);
      return;
    }
    if (this.#mode !== Mode.DEFAULT) {
      this.#editComponent.reset(this.#point);
      this.#replaceEditToPoint();
    }
  }

  setAborting() {
    const resetFormState = () => {
      this.#editComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      this.#action,
      UpdateType.MINOR,
      {...point},
    );
  };

  #handleDeleteClick = (point) => {
    if(this.#mode === Mode.ADDING){
      this.#removeAddingForm();
      return;
    }
    this.#handleDataChange(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDemoClick = () => {
    this.#editComponent.reset(this.#point);
    this.#replaceEditToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      this.#action,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
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

  #removeAddingForm() {
    document.querySelector('.trip-main__event-add-btn').disabled = false;
    remove(this.#editComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editComponent.reset(this.#point);
      if (this.#mode === Mode.ADDING){
        this.#removeAddingForm();
      } else {

        this.#replaceEditToPoint();
      }
    }
  };

  destroy () {
    remove(this.#pointComponent);
    remove(this.#editComponent);
  }
}
