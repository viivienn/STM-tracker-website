import React, {useState, useEffect} from "react";
import { Table } from 'reactstrap'
import { getFavorites, getStmArrivals, deleteFavorites } from '../../services/stm'


function loadSchedule({name, arrivals}) {
    let tableRows = []
    let validationRowResults = []
    if (arrivals) {
      if (arrivals.length === 0) {
        tableRows.push(
          <tr>
            <th>No schedule found</th>
          </tr>
        )
      }
      let count = 0
      for (let i=0; i < arrivals.length; i++) {
        const array = arrivals
          if (count < 10) {
            if(array[i].length === 1 || array[i].length === 2) {
              tableRows.push(<tr><td style={{color: "red"}}>{array[i]}</td></tr>)
          } else {
            let formatedHours = ''
            const hoursString = array[i].toString()
            if(array[i].length === 3) {
              formatedHours = `${hoursString[0]}:${hoursString[1]}${hoursString[2]}`
            } else {
              formatedHours = `${hoursString[0]}${hoursString[1]}:${hoursString[2]}${hoursString[3]}`
            }
            tableRows.push(
              <tr>
                <td>{formatedHours}</td>
              </tr>
            ) }
            validationRowResults.push(array[i])
            count = count + 1
          } else {
            break
          }
      }
    }
    else {
      tableRows.push(
        <tr>
          <th>No schedule found</th>
        </tr>
      )
    }
    return (
      <Table>
        <thead>
          <tr>
            <th>
              Prochains passages pour l'arrêt {name}
            </th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    )

}

export default function Favorites( stat) {
    let state = stat.state.state
    const tableRows = []

    let [selectedFavorite, setSelectedFavorite] = useState(null)
    let [removeFavorite, setRemoveFavorite] = useState(null)
    let [allFavorite, setAllFavorite] = useState(state.favorites)

    useEffect(() => {
      // check that props.data.status is non-empty and update statusValue
      setAllFavorite(state.favorites);

    }, [state.favorites]);
    
    if (allFavorite) {
        for (const value of allFavorite) {
          tableRows.push(
            <tr>
              <th>{value.name}</th>
              <th>{value.route}</th>
              <td>{value.dir}</td>
              <td>{value.stop}</td>
              <td onClick={async (e) => {
                e.preventDefault()
                setSelectedFavorite({
                  name: value.name,
                  arrivals: await getStmArrivals(value.route, value.dir, value.stop)})
            }}
            >
                [...]
              </td>
              <td onClick={async (e) => {
                e.preventDefault()
                setRemoveFavorite(await deleteFavorites(value.route, value.dir, value.stop, value.name, value.lat, value.lon))
                setAllFavorite(await getFavorites())
                setSelectedFavorite(null)
                stat.state.favoriteReset()
            }}>-</td>
            </tr>
          )
        }
      }
    return (<div>
        {allFavorite ? (<Table>
          <thead>
            <tr>
              <th>
                Favoris
              </th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </Table>) : (<div>No favorites</div>) 
         }

         {selectedFavorite ?(<div>
           {loadSchedule(selectedFavorite)}
           </div>):(<div></div>) }

    </div>)
}