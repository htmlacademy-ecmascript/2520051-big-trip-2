export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const DateFormat = {
  DATE_TIME: 'YYYY-MM-DDTHH:mm',
  HUMAN: 'D MMM',
  TIME: 'HH:mm',
  DATE_DB: 'YYYY-MM-DD',
  BRITAIN: 'DD/MM/YY HH:mm'
};

export const DataStatus = {
  EMPTY: 'Click New Event to create your first point',
  ERROR: 'Data loading error'
};

export const Filter = {
  DEFAULT: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};


export const SortType = {
  DEFAULT: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
