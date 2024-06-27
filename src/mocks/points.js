import { offers } from './offers.js';
import { destinations } from './destinations.js';

const getRandomDate = () => {
  const start = new Date(2018, 0, 1);
  const end = new Date(2024, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomOffers = (type) => {
  const offersAll = offers.find((offer) => offer.type === type).offers;
  const randomCount = Math.floor(Math.random() * 4);
  const shuffled = offersAll.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, randomCount).map((offer) => offer.id);
};

const getRandomDestination = () => destinations[Math.floor(Math.random() * destinations.length)]['id'];

const generatePoints = () => {
  const points = [];
  const types = offers.map((offer) => offer.type);
  for (let i = 0; i < 6; i++) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    const dateFrom = getRandomDate();
    const dateTo = new Date(dateFrom.getTime() + Math.random() * (12 * 60 * 60 * 1000)); // Random duration up to 12 hours

    const point = {
      id: crypto.randomUUID(),
      basePrice: Math.floor(Math.random() * 2000) + 500,
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      destination: getRandomDestination(),
      isFavorite: Math.random() < 0.5,
      type: randomType,
      offers: getRandomOffers(randomType)
    };

    points.push(point);
  }
  return points;
};

export const pointsData = generatePoints();
