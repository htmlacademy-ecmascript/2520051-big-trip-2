import AbstractView from '../framework/view/abstract-view.js';

const sortModes = [
  {
    TYPE: 'day',
    HTML: 'Day',
    DISABLED: '',
  },
  {
    TYPE: 'event',
    HTML: 'Event',
    DISABLED: 'disabled',
  },
  {
    TYPE: 'time',
    HTML: 'Time',
    DISABLED: '',
  },
  {
    TYPE: 'price',
    HTML: 'Price',
    DISABLED: '',
  },
  {
    TYPE: 'offer',
    HTML: 'Offers',
    DISABLED: 'disabled',
  },
];

function createSortItems(sortType) {
  const sortMenuList = [];
  sortModes.forEach((sortItem) => {
    sortMenuList.push(
      `<div class="trip-sort__item  trip-sort__item--${sortItem.TYPE}">
      <input id="sort-${sortItem.TYPE}" class="trip-sort__input  visually-hidden" type="radio" 
        name="trip-sort" value="sort-${sortItem.TYPE}" ${sortItem.DISABLED} ${sortItem.TYPE === sortType ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${sortItem.TYPE}" >${sortItem.HTML}</label>
    </div>`
    );
  });

  return (sortMenuList.join(''));
}

function createSortMenuTemplate(sortType) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
${createSortItems(sortType)}
  </form>
`
  );
}

export default class SortMenuView extends AbstractView {

  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor(currentSortType, onSortTypeChange) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortMenuTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.#handleSortTypeChange(evt.target.value.replace('sort-', ''));
  };
}
