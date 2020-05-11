import React from 'react'
import './Schedule.css'
import { Table } from 'reactstrap'
import Favorites from '../Favorites/favorites';
import { getStmStops, getStmArrivals, getFavorites, addFavorites, getArrivalsSoon } from '../../services/stm'
import  Map  from '../Map/map'

class Schedule extends React.Component {
  constructor(props) {
    super(props)
    this.timer = this.timer.bind(this)
    this.checkSchedule = this.checkSchedule.bind(this)
    this.chosenDirection = this.chosenDirection.bind(this)
    this.setAllStates = this.setAllStates.bind(this)
    this.resetFavorites = this.resetFavorites.bind(this)
    this.setState({
      loading: true,
      stops: {},
      id: '',
      category: '',
      name: '',
      direction: '',
      directionChosen: '',
      stopSchedule: '',
      time: '',
      stopScheduleArray: [],
      mode: 'schedule',
      favorites: []
    })
  }


  async componentDidMount() {
    this.state.favorites = await getFavorites()
    this.setState(this.state)
    setInterval(this.timer, 10000)
  }

  async getStmStops() {
    if (this.state.directionChosen && this.state.id) {
      const stop = this.state.id + '-' + this.state.directionChosen[0]
        await getStmStops(this.state.id, this.state.directionChosen[0]).then(
          stops => {
        
            if(stops.message) {
              this.state.loading = false
              this.state.error = stops.message
              this.setState(this.state)
            } else {
            this.state.error = ''
            this.state.loading = false
            this.state.stops = stops
            this.setState(this.state)
          }
          }
        )
      
    }
  }

  async getStmArrivals() {
    if(this.state.stopSchedule.id) {
      await getStmArrivals(
        this.state.id,
        this.state.directionChosen[0],
        this.state.stopSchedule.id
      ).then(arrivals => {
        if(arrivals.message) {
          this.state.error = arrivals.message
          this.state.stopScheduleArray = []
          this.setState(this.state)
        } else {
          this.state.error = ''
          this.state.stopScheduleArray = arrivals
          this.setState(this.state)
        }
      })
    }

  }

  async timer() {
    if(this.state.mode === 'schedule') {
      const date = new Date()
      this.state.time = `${date.getHours()}${date.getMinutes()}`
      await this.getStmArrivals()
      this.setState(this.state)
    }
  }

  setAllStates() {
    if (this.props.match.params.id) {
      if (
        this.state &&
        this.state.directionChosen &&
        this.state.id === this.props.match.params.id
      ) {
        this.state = {
          loading: false,
          stops: this.state.stops,
          id: this.props.match.params.id,
          category: this.props.match.params.category,
          name: this.props.location.query.name,
          direction: this.props.location.query.direction.split(','),
          directionChosen: this.state.directionChosen,
          stopSchedule: this.state.stopSchedule,
          time: this.state.time,
          stopScheduleArray: this.state.stopScheduleArray,
          mode: this.state.mode,
          error: this.state.error,
          favorites: this.state.favorites

        }
      } else if (this.state && this.state.id === this.props.match.params.id) {
        this.state = {
          loading: false,
          stops: this.state.stops,
          id: this.props.match.params.id,
          category: this.props.match.params.category,
          name: this.props.location.query.name,
          direction: this.props.location.query.direction.split(','),
          directionChosen: this.state.directionChosen,
          stopSchedule: '',
          stopScheduleArray: this.state.stopScheduleArray,
          mode: this.state.mode,
          error: this.state.error,
          favorites: this.state.favorites
        }
      } else {
        this.state = {
          loading: false,
          stops: this.state.stops,
          id: this.props.match.params.id,
          category: this.props.match.params.category,
          name: this.props.location.query.name,
          direction: this.props.location.query.direction.split(','),
          directionChosen: '',
          stopSchedule: '',
          stopScheduleArray: this.state.stopScheduleArray,
          mode: this.state.mode,
          error: this.state.error,
          favorites: this.state.favorites
        }
      }
    } else {
      this.state = {
        loading: false,
        stops: {},
        id: '',
        category: '',
        name: '',
        direction: '',
        directionChosen: '',
        stopSchedule: '',
        time: '',
        stopScheduleArray: [],
        mode: 'schedule',
        error: '',
        favorites: []
      }
    }
  }


  async checkSchedule(name, id) {
    this.state.stopSchedule = { name, id }
    await this.getStmArrivals()
    this.setState(this.state)
  }

  async addFavorites(route, direction, stopCode, name, lat, lon) {
    await addFavorites(route, direction, stopCode, name, lat, lon)
    this.state.favorites = await getFavorites()
    this.setState(this.state)
  }

  async resetFavorites() {
    this.state.favorites = await getFavorites()
    this.setState(this.state)
  }

  async chosenDirection(value) {
    this.state.directionChosen = value
    await this.getStmStops()
    this.setState(this.state)
  }

  loadScheduleTable() {
    if (this.state && this.state.stopSchedule && !this.state.error) {
      let tableRows = []
      let validationRowResults = []
      if (this.state.stopScheduleArray) {
        if (this.state.stopScheduleArray.length === 0) {
          tableRows.push(
            <tr>
              <th>No schedule found</th>
            </tr>
          )
        }
        let count = 0
        for (let i=0; i < this.state.stopScheduleArray.length; i++) {
          const array = this.state.stopScheduleArray
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
      } else if (this.state.error) {
        tableRows.push(
          <tr>
            <th>{this.state.error}</th>
          </tr>
        )
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
                Prochains passages pour l'arrêt {this.state.stopSchedule.name}
              </th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </Table>
      )
    }
  }

  loadingTable() {
    if (!this.state.id) {
      return this.defaultMessage()
    } else {
      return this.directionTable()
    }
  }
  loadLineTables() {
    if (this.state.directionChosen && !this.state.error) {
      let tableRows = []
      let charDirection = this.state.directionChosen[0]
      let busLine = `${this.state.id}-${charDirection}`
      // if (this.state.stops[busLine] === undefined) {
      //   charDirection = 'W'
      //   busLine = `${this.state.id}-${charDirection}`
      // }
      if (this.state.stops) {
        for (const value of this.state.stops) {
          tableRows.push(
            <tr>
              <th>{value.name}</th>
              <td>{value.id}</td>
              <td onClick={() => this.checkSchedule(value.name, value.id)}>
                [...]
              </td>
              <td onClick={() => this.addFavorites(this.state.id, this.state.directionChosen[0], value.id, value.name, value.lat, value.lon)}>
                +</td>
            </tr>
          )
        }
      } else if(this.state.error) {
        {
          tableRows.push(
            <tr>
              <td>{this.state.error}</td>
            </tr>
          )
        }
      }
      else {
        tableRows.push(
          <tr>
            <td>No line routes found!</td>
          </tr>
        )
      }
      return (
        <Table>
          <thead>
            <tr>
              <th>Arret</th>
              <th>Code</th>
              <th>Horaire</th>
              <th>Favoris</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </Table>
      )
    }
  }

  defaultMessage() {
    return <span> Please Choose a line </span>
  }

  directionTable() {
    return (
      <div>
        <span>
          {' '}
          ( {this.state.id} {this.state.name} - {this.state.directionChosen} ){' '}
        </span>
        <br />
        <br />

                <button
                  onClick={() => this.setMode('schedule')}
                >Schedule
                </button>
                <button
                  onClick={() => this.setMode('map')}
                >Map
                </button>
        <Table>
          <thead>
            <tr>
              <th>location</th>
              <th>direction</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                {this.state.id} {this.state.name}
              </th>
              <td>
                <button
                  onClick={() => this.chosenDirection(this.state.direction[0])}
                >
                  {this.state.direction[0]}
                </button>
                <button
                  onClick={() => this.chosenDirection(this.state.direction[1])}
                >
                  {this.state.direction[1]}
                </button>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }

  setMode(mode){
    this.state.mode = mode
    this.state.error = ''
    this.setState(this.state)
  }
  scheduleMode(){
    return this.state.mode === 'schedule'
  }
  loadMap() {
    if(this.state.error) {
      return (this.state.error)
    } else if(!this.state.directionChosen) {
      return 'Please choose a line'
    } else {
      return (<Map state={this.state}></Map>)
    }
  }
  loadFavorites(){
    const state = {
      state: this.state,
      favoriteReset: this.resetFavorites
    }
    return (<Favorites state={state}></Favorites>)
  }


  render() {
    this.setAllStates()
    if(this.scheduleMode()){
      return (
        <div className='body'>
          {this.loadFavorites()}
          {this.loadingTable()}
          {this.loadLineTables()}
          {this.loadScheduleTable()}
        </div>
      )
    }
   else{
     return(
      <div className='body'>
          {this.loadFavorites()}
          {this.loadingTable()}
          {this.loadMap()}

    </div>
     )
   }
  }
}

export default Schedule
