import AbstractView from '../framework/view/abstract-view.js';

const filters = [
  'everything',
  'future',
  'present',
  'past'
];

function createFilterItems(currentFilter){
  const filterItems = [];
  filters.forEach((filter) => {
    filterItems.push(
      `
      <div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${ filter === currentFilter ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
      </div>
      `
    );
  });
  return (filterItems.join(''));
}

function createFilterFormTemplate(currentFilter) {
  return (
    `<form class="trip-filters" action="#" method="get">
${createFilterItems(currentFilter)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`
  );
}

export default class FilterFormView extends AbstractView {
  #currentFilter = null;

  constructor(currentFilter){
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFilterFormTemplate(this.#currentFilter);
  }
}
