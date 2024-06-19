import TripTableView from '../view/trip-table-view.js';
import PointView from '../view/trip-point-view.js';
import NewPointFormView from '../view/adding-form-view.js';
import SortMenuView from '../view/sorting-view.js';
import EditFormView from '../view/edit-form-view.js';
import { COUNT_POINTS } from '../constants.js';
import { render } from '../render.js';
import { RenderPosition } from '../render.js';

export default class TripTablePresenter {
  tableComponent = new TripTableView();

  constructor({boardContainer, hTittle}) {
    this.boardContainer = boardContainer;
    this.hTittle = hTittle;
  }

  init() {
    render(this.tableComponent, this.boardContainer);
    render(new SortMenuView(), this.hTittle, RenderPosition.AFTEREND);
    render(new NewPointFormView(), this.tableComponent.getElement(), RenderPosition.AFTERBEGIN);
    for (let i = 0; i < COUNT_POINTS; i++) {
      render(new PointView(), this.tableComponent.getElement());
      if (i === 1) {
        render(new EditFormView(), this.tableComponent.getElement());
      }
    }
  }
}
