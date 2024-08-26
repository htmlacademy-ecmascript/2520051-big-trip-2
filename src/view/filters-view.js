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
  #handleFilterChange = null;
  #disabled;

  constructor(currentFilter, onFilterGange){
    super();
    this.#currentFilter = currentFilter;
    this.#handleFilterChange = onFilterGange;

    this._restoreHandlers();
  }

  get template() {
    return createFilterFormTemplate(this.#currentFilter, this.#disabled);
  }

  _restoreHandlers = () => {
    const filterElements = this.element.querySelectorAll('.trip-filters__filter-input');
    filterElements.forEach((element) => {
      element.addEventListener('click', (evt) => {
        this.#handleFilterChange(evt.target.value);
      });
    });
  };
}
