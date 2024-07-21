import {render} from '../framework/render.js';
import InfoView from '../view/trip-info-view.js';
import { RenderPosition } from '../constants.js';


export default class InfoPresenter {
  init(headerElement) {
    render(new InfoView(), headerElement, RenderPosition.AFTERBEGIN);
  }
}
