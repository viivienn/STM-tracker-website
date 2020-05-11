import mongoose from 'mongoose';
import BusLines from './busLines';
import BusStops from './busStops';
import BusArrivals from './busArrivals';
import BusPositions from './busPositions';
import Favorites from './favorites';

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL);
};
const models = { BusLines, BusStops, BusArrivals, BusPositions, Favorites };
export { connectDb };
export default models;
