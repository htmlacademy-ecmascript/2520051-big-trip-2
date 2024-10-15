import {remove, render} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import { RenderPosition } from '../constants.js';
import { sortByDay } from '../utils.js';

export default class InfoPresenter {
  #pointsModel;
  #destinationModel;
  #offersModel;
  #sortPoints;
  #infoComponent = null;

  constructor(pointsModel, destinationModel, offersModel){
    this.#pointsModel = pointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
  }

  init(headerElement) {
    let total = 0;
    this.#sortPoints = [...this.#pointsModel.getPoints()].sort((a, b) => sortByDay(a, b));

    if (this.#sortPoints !== null && this.#sortPoints.length > 0){
      this.#sortPoints.forEach((point) => {
        total += point.basePrice;
        const offerList = this.#offersModel.getOffersByType(point.type).offers;
        for(let i = 0; i < point.offers.lenght; i++){
          total += offerList.find((offer) => offer.id === point.offers[i]).price;
        }
      });
      const dateFrom = this.#sortPoints[0].dateFrom;
      const dateTo = this.#sortPoints.at(-1).dateTo;

      const route = this.#getRout();
      this.#infoComponent = new TripInfoView(total, route, dateFrom, dateTo);
      render(this.#infoComponent, headerElement, RenderPosition.AFTERBEGIN);
    }
  }

  removeView() {
    remove(this.#infoComponent);
  }

  #getRout() {
    const destinationList = this.#sortPoints.map((point) => this.#destinationModel.getDestinationById(point.destination).name);
    const destinationSet = new Set(destinationList);

    if(destinationSet.size === 1){
      return ([destinationList.at(0)]);
    }
    if(destinationSet.size > 3) {
      return ([
        destinationList.at(0),
        '...',
        destinationList.at(-1)
      ]);
    }
    if(destinationSet.size === 2 && destinationList.at(0) !== destinationList.at(-1)){
      return (Array.from(destinationSet));
    }
    if(destinationSet.size === 2 && destinationList.at(0) === destinationList.at(-1)){
      return ([
        destinationList.at(0),
        Array.from(destinationSet).at(1),
        destinationList.at(-1)
      ]);
    }
    if(destinationSet.size === 3){
      if(destinationList.at(-1) === Array.from(destinationSet).at(-1)) {
        return(Array.from(destinationSet));
      }
      return ([
        destinationList.at(0),
        '...',
        destinationList.at(-1)
      ]);
    }
  }

}
