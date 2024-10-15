import AbstractView from '../framework/view/abstract-view.js';

function createFilterItems(currentFilter, filterMap){
  const filterItems = [];
  Object.keys(filterMap).forEach((filter) => {
    filterItems.push(
      `
      <div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" 
        name="trip-filter" value="${filter}" ${ filter === currentFilter ? 'checked' : ''}
        ${ filterMap[filter] ? '' : 'disabled'}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
      </div>
      `
    );
  });
  return (filterItems.join(''));
}

function createFilterFormTemplate(currentFilter, filterMap) {
  return (
    `<form class="trip-filters" action="#" method="get">
${createFilterItems(currentFilter, filterMap)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`
  );
}

export default class FiltersView extends AbstractView {
  #currentFilter;
  #handleFilterChange;
  #filterMap;

  constructor(currentFilter, onFilterGange, filterMap){
    super();
    this.#currentFilter = currentFilter;
    this.#handleFilterChange = onFilterGange;
    this.#filterMap = filterMap;

    this._restoreHandlers();
  }

  get template() {
    return createFilterFormTemplate(this.#currentFilter, this.#filterMap);
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
