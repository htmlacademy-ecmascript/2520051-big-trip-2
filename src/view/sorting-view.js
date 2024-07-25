import AbstractView from '../framework/view/abstract-view.js';
// import {DataSort as SortMode} from '../constants.js';

const SortMode = [
  {
    TYPE: 'day',
    HTML: 'Day',
    DISABLED: '',
    CHECKED: 'checked'
  },
  {
    TYPE: 'event',
    HTML: 'Event',
    DISABLED: 'disabled',
    CHECKED: ''
  },
  {
    TYPE: 'time',
    HTML: 'Time',
    DISABLED: '',
    CHECKED: ''
  },
  {
    TYPE: 'price',
    HTML: 'Price',
    DISABLED: '',
    CHECKED: ''
  },
  {
    TYPE: 'offer',
    HTML: 'Offers',
    DISABLED: 'disabled',
    CHECKED: ''
  },
];

function createSortItems() {
  const sortMenuList = [];
  SortMode.forEach((sortItem) => {
    sortMenuList.push(
      `<div class="trip-sort__item  trip-sort__item--${sortItem.TYPE}">
      <input id="sort-${sortItem.TYPE}" class="trip-sort__input  visually-hidden" type="radio" 
        name="trip-sort" value="sort-${sortItem.TYPE}" ${sortItem.DISABLED} ${sortItem.CHECKED}>
      <label class="trip-sort__btn" for="sort-${sortItem.TYPE}" >${sortItem.HTML}</label>
    </div>`
    );
  });

  return (sortMenuList.join(''));
}

function createSortMenuTemplate() {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
${createSortItems()}
  </form>
`
  );
}

export default class SortMenuView extends AbstractView {

  #handleSortTypeChange = null;

  constructor(onSortTypeChange) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortMenuTemplate();
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.#handleSortTypeChange(evt.target.value.replace('sort-', ''));
  };
}
