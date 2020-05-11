import React from 'react';
import { Row, Col } from 'reactstrap';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { getArrivalsSoon } from '../../services/stm'

class Header extends React.Component{

    constructor(props){
        super(props)
        this.arrivalsTimer = this.arrivalsTimer.bind(this)
        this.setState({arrivals: []})
    }

    async componentWillMount() {
        const arrivals = await getArrivalsSoon()
        this.setState({arrivals})
    }

    async componentDidMount() {
        setInterval(this.arrivalsTimer, 300000)
    }

    async arrivalsTimer() {
        const arrivals = await getArrivalsSoon()
        this.state.arrivals = arrivals
        this.setState(this.state)
    }

    loadArrivals() {
        console.log(this.state)
        if (this.state && this.state.arrivals.length > 0) {
            let message = ''
            for (let i=0; i< this.state.arrivals.length; i++) {
                message = message + this.state.arrivals[i].message + ' \n \n \n'
            }
            return (
                <div>
                {
                    NotificationManager.info(message, 'Arrivals', 10000)
                }
                <NotificationContainer/>
                </div>)
        }
        return
    }

    render(){
        return(
           <div>
            <Row>
            <Col xs="3"><img src="http://www.stm.info/sites/all/themes/stm/img/header-logo.png" alt="BusTracker" /></Col>
            <Col xs="9">
            <img src="http://www.stm.info/sites/all/themes/stm/img/header-logo.png" alt="BusTracker" />
            <h4>Welcome to the Bus Tracker 1.0</h4>
            {this.loadArrivals()} 
            </Col>
            </Row> 
                   
           </div>
           
        )
    }

}

export default Header;