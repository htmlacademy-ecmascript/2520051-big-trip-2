import {render} from '../framework/render.js';

import SortMenuView from '../view/sorting-view.js';
import { RenderPosition } from '../constants.js';


export default class SortPresenter {

  init (hTittle) {
    render(new SortMenuView(), hTittle, RenderPosition.AFTEREND);
  }
}
