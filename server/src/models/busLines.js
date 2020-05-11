import mongoose from 'mongoose';
const busLinesSchema = new mongoose.Schema({
  busLines: {
    type: Array,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
    expires: 3600
    }
});
const BusLines = mongoose.model('BusLines', busLinesSchema);
export default BusLines;