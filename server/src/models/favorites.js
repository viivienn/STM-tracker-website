import mongoose from 'mongoose';

const favoritesSchema = new mongoose.Schema({
    route: {
        type: String,
        unique: false
    },
    dir: {
        type: String,
        unique: false
    },
    stop: {
        type: String,
        unique: false
    },
    lat: {
        type: String,
        unique: false
    },
    lon: {
        type: String,
        unique: false
    },
    name: {
        type: String,
        unique: false
    }
});
const Favorites = mongoose.model('Favorites', favoritesSchema);
export default Favorites;