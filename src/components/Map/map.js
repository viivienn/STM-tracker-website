import React, {useState, setState} from "react";
import MapGL, { Marker, Popup, Layer, Source}  from "react-map-gl"
import { getStmArrivals, getBusPos } from '../../services/stm'

let busPositions = []
let route = '';
let direction = '';
let id = '';
setInterval(async () => {
    if(route && direction) {
        busPositions = await getBusPos(route, direction[0]).then(result => result)
    }
}, 10000)

async function getSchedule(route, direction, stopCode){
    let scheduleTable = []
    if(stopCode) {
        const arrivals = await getStmArrivals(route, direction[0], stopCode).then(result => result)
        if(arrivals.message) {
            scheduleTable.push(<p>{arrivals.message}</p>)
        } else {
            for(let i = 0; i < arrivals.length; i ++) {
                if(i < 10) {
                    if(arrivals[i].length === 1 || arrivals[i].length === 2) {
                        scheduleTable.push(<div style={{color: "red"}}>{arrivals[i]}</div>)
                    } else {
                        let formatedHours = ''
                        const hoursString = arrivals[i].toString()
                        if(arrivals[i].length === 3) {
                            formatedHours = `${hoursString[0]}:${hoursString[1]}${hoursString[2]}`
                        } else {
                            formatedHours = `${hoursString[0]}${hoursString[1]}:${hoursString[2]}${hoursString[3]}`
                        }
                        scheduleTable.push(<div>{formatedHours}</div>)
                    }
                }
            }
        }
    }
    return scheduleTable
}

function getStopName(state, selectedBus) {
    let name = []
    state.state.stops.filter(stop=>{
        if(stop.id === selectedBus['next_stop']){
            name.push(<p>{stop.name}</p>)
        }
    })
    return name
}

export default function Map(state) {
    console.log(state)
    route = state.state.id;
    direction = state.state.directionChosen;

    let coordinates = state.state.stops.map(element => {
        return [element.lon, element.lat]
    })

    let coords = [];
    let length = coordinates.length;

    let startCoord  = coordinates[0];
    let finishCoord = coordinates[length - 1];

    coords.push((Number(startCoord[1]) + Number(finishCoord[1])) / 2); // lat
    coords.push((Number(startCoord[0]) + Number(finishCoord[0])) / 2); // lon

    let [viewport, setViewPort] = useState({
        latitude: 45.4972159,
        longitude:-73.6103642,
        width: "80vw",
        height: "80vh",
        zoom: 12,
    }); 

    let data = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: coordinates
        }
    };

    let [selectedStop, setSelectedStop] = useState(null)
    let [selectedSchedule, setSelectedSchedule] = useState(null)
    let [selectBusPositions, setBusPositions] = useState(null)
    let [selectedBus, setSelectedBus] = useState(null)
    

    if(!id) {
        setInterval(()=> {
            id=1
            setBusPositions(busPositions)
        }, 10000)
    }
    return direction ? (
        <div>
            <MapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                onViewportChange={viewport=>{
                    setViewPort(viewport)
                    viewport.latitude   = Number(coords[0]);
                    viewport.longitude  = Number(coords[1]);
                }}
            >
             {state.state.stops.map( stop => (
                 <Marker 
                    key={stop.id}
                    latitude={parseFloat(stop.lat)}
                    longitude={parseFloat(stop.lon)}
                >
                    <button className="marker-btn" onClick={async (e) =>{
                        e.preventDefault()
                        setSelectedStop(stop)
                        setSelectedSchedule(await getSchedule(state.state.id, state.state.directionChosen, stop.id))
                    }}>
                        <img src={require("./download.svg")} alt="bus stop"></img>
                    </button>
                 </Marker>
             ))}
              {state.state.favorites.map( favorite => (
                 <Marker 
                    key={favorite.stop}
                    latitude={parseFloat(favorite.lat)}
                    longitude={parseFloat(favorite.lon)}
                >
                    <button className="marker-btn" onClick={async (e) =>{
                        e.preventDefault()
                        setSelectedStop(favorite)
                        setSelectedSchedule(await getSchedule(favorite.route, favorite.dir, favorite.stop))
                    }}>
                        <img src={require("./favorite.svg")} alt="favorite stop"></img>
                    </button>
                 </Marker>
             ))}
            {selectedStop ? (
                <Popup 
                    latitude={parseFloat(selectedStop.lat)}
                    longitude={parseFloat(selectedStop.lon)}
                    onClose={()=> {
                        setSelectedStop(null);
                        setSelectedSchedule(null);
                    }}>
                    <div>
                        <h2>{selectedStop.name}</h2>
                        {selectedSchedule}
                    </div>
                </Popup>
            ) : null}
            {busPositions ?  busPositions.map( position => (
                <Marker 
                    latitude={parseFloat(position.lat)}
                    longitude={parseFloat(position.lon)}
                >
                    <button className="marker-btn" onClick={async (e) =>{
                        e.preventDefault()
                        setSelectedBus(position)
                    }}>
                         <img src={require("./bus_position.svg")} alt="bus position"></img>
                    </button>
                   
                </Marker>

            )): ''
            }
            {selectedBus ? (
                <Popup 
                    latitude={parseFloat(selectedBus.lat)}
                    longitude={parseFloat(selectedBus.lon)}
                    onClose={()=> {
                        setSelectedBus(null);
                    }}>
                    <div>
                        {
                        getStopName(state, selectedBus)
                       }
                    </div>
                </Popup>
            ) : null}
            <Source id="route" type="geojson" data={data} />
            <Layer
                id="route"
                type="line"
                source="route"
                layout={{
                'line-join': 'round',
                'line-cap': 'round'
                }}
                paint={{
                'line-color': '#DC143C',
                'line-width': 8
                }}
            />
            </MapGL>
        </div>
    ) : (<div>Please choose a direction</div>)
    
}
