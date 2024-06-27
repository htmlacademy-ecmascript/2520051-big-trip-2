import TripTableView from '../view/trip-table-view.js';
import PointView from '../view/trip-point-view.js';
import NewPointFormView from '../view/adding-form-view.js';
import SortMenuView from '../view/sorting-view.js';
import { render } from '../render.js';
import { RenderPosition } from '../render.js';


export default class TripTablePresenter {
  tableComponent = new TripTableView();

  constructor(boardContainer, hTittle, models) {
    this.boardContainer = boardContainer;
    this.hTittle = hTittle;
    this.offersModel = models.offers;
    this.destinationModel = models.destination;
    this.pointsModel = models.points;
  }

  init() {
    const offersAll = this.offersModel.getAll();
    const points = this.pointsModel.getAll();
    const destinations = this.destinationModel.getAll();

    render(this.tableComponent, this.boardContainer);
    render(new SortMenuView(), this.hTittle, RenderPosition.AFTEREND);
    render(new NewPointFormView(destinations, offersAll), this.tableComponent.getElement(), RenderPosition.AFTERBEGIN);
    points.forEach((point) => {
      const offersByType = offersAll.find((offer) => offer.type === point.type);
      const destination = destinations.find((dest) => dest.id === point.destination);
      render(new PointView(point, offersByType,destination), this.tableComponent.getElement());
    });
    // render(new EditFormView(), this.tableComponent.getElement());
  }
}
