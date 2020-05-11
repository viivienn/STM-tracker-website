import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import uuidv4 from 'uuid/v4';
import models, { connectDb } from './src/models/db';

const axios = require('axios');
const app = express()
const api_url_lines = 'http://teaching-api.juliengs.ca/gti525/STMLines.py?apikey=01AN27450'
const api_url_stops = 'http://teaching-api.juliengs.ca/gti525/STMStops.py?apikey=01AN27450'
const api_url_arrivals = 'http://teaching-api.juliengs.ca/gti525/STMArrivals.py?apikey=01AN27450'
const api_url_pos = 'http://teaching-api.juliengs.ca/gti525/STMPositions.py?apikey=01AN27450'

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

models.BusLines.remove({}, function(err) { 
    console.log('BusLines dropped') 
});

models.BusStops.remove({}, function(err) { 
    console.log('BusStops dropped') 
 });

 models.BusArrivals.remove({}, function(err) { 
    console.log('BusArrivals dropped') 
 });

 models.BusPositions.remove({}, function(err) { 
    console.log('BusPositions dropped') 
 });

 models.Favorites.remove({}, function(err) { 
  console.log('Favorites dropped') 
});

app.get('/busLines', async (req, res) => {
    const result = await models.BusLines.find().then(result => result).catch(err => console.log(err))
    if (result.length > 0) {
        console.log('cache busline and direction')
        return res.send(result[0].busLines)
    }
    const buslines = await axios.get(api_url_lines)
      .then(async response => {
        console.log('api busline and direction')
        const busLinesModel = new models.BusLines({
            busLines: response.data
          });
        await busLinesModel.save();
        return response.data
      })
      .catch(error => {
        console.log(error);
      });
    res.send(buslines)
})

app.get('/busStops', async (req, res) => {
    const route = req.query.route
    const dir = req.query.direction
    const routeDir = `${route}-${dir}`
    const result = await models.BusStops.find({
        routeDir
    }).then(result => result).catch(err => console.log(err))
    if (result.length > 0) {
        console.log('cache busStops')
        return res.send(result[0].busStops)
    }
    const busstops = await axios.get(`${api_url_stops}&route=${route}&direction=${dir}`)
      .then(async response => {
        console.log('api busStops')
        const busStopsModel = new models.BusStops({
            routeDir,
            busStops: response.data
          });
        await busStopsModel.save();
        return response.data
      })
      .catch(error => {
        console.log(error);
      });
    res.send(busstops)
})

app.get('/busArrivals', async (req, res) => {
    const route = req.query.route
    const dir = req.query.direction
    const stop = req.query.stopCode
    const routeDirStop = `${route}-${dir}-${stop}`
    const result = await models.BusArrivals.find({
        routeDirStop
    }).then(result => result).catch(err => console.log(err))
    if (result.length > 0) {
        console.log('cache busArrivals')
        return res.send(result[0].busArrivals)
    }
    const busArrivals = await axios.get(`${api_url_arrivals}&route=${route}&direction=${dir}&stopCode=${stop}`)
      .then(async response => {
        console.log('api busArrivals')
        const busArrivalsModel = new models.BusArrivals({
            routeDirStop,
            busArrivals: response.data
          });
        await busArrivalsModel.save();
        return response.data
      })
      .catch(error => {
        console.log(error);
      });
    res.send(busArrivals)
})

app.get('/busPositions', async (req, res) => {
    const route = req.query.route
    const dir = req.query.direction
    const routeDir = `${route}-${dir}`
    const result = await models.BusPositions.find({
        routeDir
    }).then(result => result).catch(err => console.log(err))
    if (result.length > 0) {
        console.log('cache busPositions')
        return res.send(result[0].busPositions)
    }
    const busPositions = await axios.get(`${api_url_pos}&route=${route}&direction=${dir}`)
      .then(async response => {
        console.log('api busPositions')
        const busPositionsModel = new models.BusPositions({
            routeDir,
            busPositions: response.data
          });
        await busPositionsModel.save();
        return response.data
      })
      .catch(error => {
        console.log(error);
      });
    res.send(busPositions)
})

app.get('/busArrivals', async (req, res) => {
  const route = req.query.route
  const dir = req.query.direction
  const stop = req.query.stopCode
  const routeDirStop = `${route}-${dir}-${stop}`
  const result = await models.BusArrivals.find({
      routeDirStop
  }).then(result => result).catch(err => console.log(err))
  if (result.length > 0) {
      console.log('cache busArrivals')
      return res.send(result[0].busArrivals)
  }
  const busArrivals = await axios.get(`${api_url_arrivals}&route=${route}&direction=${dir}&stopCode=${stop}`)
    .then(async response => {
      console.log('api busArrivals')
      const busArrivalsModel = new models.BusArrivals({
          routeDirStop,
          busArrivals: response.data
        });
      await busArrivalsModel.save();
      return response.data
    })
    .catch(error => {
      console.log(error);
    });
  res.send(busArrivals)
})

app.post('/favorites', async (req, res) => {
  const route = req.query.route
  const dir = req.query.direction
  const stop = req.query.stopCode
  const name = req.query.name
  const lat = req.query.lat
  const lon = req.query.lon
  const result = await models.Favorites.find().then(result => result).catch(err => console.log(err))
  if (result.length === 10) {
      return res.status(400).json({message:"Favorite list is full! Must delete a favorite to add new favorite."})
  }
  const exist = await models.Favorites.find({
    route,
    dir,
    stop,
    name,
    lat,
    lon
  }).then(result => result).catch(err => console.log(err))

  if(exist.length >= 1){
    return res.status(400).json({message:"Already exists in Favorites!"})
  }
  const favoritesModel = new models.Favorites({
      route,
      dir,
      stop,
      name,
      lat,
      lon
    });
      await favoritesModel.save();
    res.status(200).send("Favorite is added!")
})

app.get('/favorites', async (req, res) => {
  const result = await models.Favorites.find().then(result => result).catch(err => console.log(err))
  res.status(200).send(result)
})

app.delete('/favorites', async (req, res) => {
  const route = req.query.route
  const dir = req.query.direction
  const stop = req.query.stopCode
  const name= req.query.name
  const lat = req.query.lat
  const lon = req.query.lon

  await models.Favorites.deleteOne({
    route,
    dir,
    stop,
    name,
    lat,
    lon
  }).then(() =>
    res.status(200).send("Favorite deleted!")).catch(() =>
      res.status(404).send("Favorite not found!"))
})

app.get('/arrivals', async (req, res) => {
  const result = await models.Favorites.find().then(result => result).catch(err => console.log(err))

  if(result.length > 0)
  {
    const results = []
    for(let i=0; i < result.length; i++) {
      const routeDirStop = `${result[i].route}-${result[i].dir}-${result[i].stop}`
      const arrival = await models.BusArrivals.find({routeDirStop}).then(result => result).catch(err => console.log(err))
      if(arrival.length >= 1) {
        if(arrival[0].busArrivals[0] <= 5) {
          const message = `${result[i].route} ${result[i].name} : arrivee immenente`
          results.push({
            message
          })
        }
      } else {
        const busArrivals = await axios.get(`${api_url_arrivals}&route=${result[i].route}&direction=${result[i].dir}&stopCode=${result[i].stop}`)
        .then(async response => {
          const busArrivalsModel = new models.BusArrivals({
              routeDirStop,
              busArrivals: response.data
            });
          await busArrivalsModel.save();
          if(busArrivals.length > 0 && busArrivals[0] <= 5) {
            const message = `${result[i].route} ${result[i].name} : arrivee immenente`
            results.push({
              message
            })
          }
          return response.data
        })
        .catch(error => {
          return '';
        });

        if(!busArrivals && result[i].dir === 'O') {
          const busArrivals = await axios.get(`${api_url_arrivals}&route=${result[i].route}&direction=W&stopCode=${result[i].stop}`)
        .then(async response => {
          const busArrivalsModel = new models.BusArrivals({
              routeDirStop,
              busArrivals: response.data
            });
          await busArrivalsModel.save();
          if(busArrivals.length > 0 && busArrivals[0] <= 5) {
            const message = `${result[i].route} ${result[i].name} : arrivee immenente`
            results.push({
              message
            })
          }
          return response.data
        })
        .catch(error => {
          return '';
        });
        }

      }
    }
    return res.send(results)
  }
  return res.send([])
})

connectDb().then(async () => {
    app.listen(process.env.PORT, () =>
      console.log(`Example app listening on port ${process.env.PORT}!`),
    );
  });



// app.put('/users/:userId', (req, res) => {
//     return res.send(
//       `PUT HTTP method on user/${req.params.userId} resource`,
//     );
//   });
  