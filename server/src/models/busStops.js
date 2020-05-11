import mongoose from 'mongoose';


const busStopsSchema = new mongoose.Schema({
    routeDir: {
        type: String,
        unique: true
    },
  busStops: {
    type: Array,
    unique: false,
  },
  date: {
    type: Date,
    default: Date.now,
    expires: 3600
    }
});
const BusStops = mongoose.model('BusStops', busStopsSchema);
export default BusStops;