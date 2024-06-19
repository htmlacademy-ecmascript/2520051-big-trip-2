import InfoView from '../view/trip-info-view.js';
import FilterFormView from '../view/filters-view.js';
import {render} from '../render.js';
import {RenderPosition} from '../render.js';

export default class HeaderPresenter {

  constructor({container, filterConteiner}) {
    this.container = container;
    this.filterConteiner = filterConteiner;
  }

  init() {
    render(new InfoView(), this.container, RenderPosition.AFTERBEGIN);
    render(new FilterFormView(), this.filterConteiner);
  }
}
