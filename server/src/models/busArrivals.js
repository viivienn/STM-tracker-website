import mongoose from 'mongoose';

const busArrivalsSchema = new mongoose.Schema({
    routeDirStop: {
        type: String,
        unique: true
    },
  busArrivals: {
    type: Array,
    unique: false,
  },
  date: {
    type: Date,
    default: Date.now,
    expires: 60
    }
});
const BusArrivals = mongoose.model('BusArrivals', busArrivalsSchema);
export default BusArrivals;