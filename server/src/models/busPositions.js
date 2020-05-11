import mongoose from 'mongoose';


const busPositionsSchema = new mongoose.Schema({
    routeDir: {
        type: String,
        unique: true
    },
  busPositions: {
    type: Array,
    unique: false,
  },
  date: {
    type: Date,
    default: Date.now,
    expires: 10
    }
});
const BusPositions = mongoose.model('BusPositions', busPositionsSchema);
export default BusPositions;