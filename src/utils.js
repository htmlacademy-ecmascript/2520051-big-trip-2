import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);


export const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

export const getDatetimeFormat = (date, format) => dayjs(date).format(format);

export const getDifferenceDate = (finishTerm, startTerm) => {
  const diff = dayjs.duration(dayjs(finishTerm).diff(dayjs(startTerm)));
  const days = diff.days();
  const hours = diff.hours();
  const minutes = diff.minutes();

  if (days) {
    return `${days}D ${hours}H ${minutes}M`;
  }
  if (hours) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

export const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

