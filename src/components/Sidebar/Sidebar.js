import React from 'react'
import './Sidebar.css'
//import { lines } from '../../lines.json.js'
import { Link } from 'react-router-dom'
import { getStmLines } from '../../services/stm'
import {
  UncontrolledCollapse,
  DropdownToggle,
  CardBody,
  Card,
  Nav,
  NavItem
} from 'reactstrap'

class Sidebar extends React.Component {
  constructor(props) {
    super()
    this.state = {
      loading: true,
      lines: []
    }
  }

  selectLine(id) {
    this.state.id = id
    this.setState(this.state)
  }

  componentDidMount() {
    this.getStmLines()
  }

  async getStmLines() {
    if (this.state.lines.length === 0) {
      getStmLines().then(lines => {
        if(lines.message) {
          this.setState({
            loading: false,
            error: lines.message
          })
        } else {
          this.setState({
            loading: false,
            lines
          })
        }
        
      })
    }
  }

  render() {
    const all = []
    const local = []
    const night = []
    const express = []
    const shuttleOr = []
    const dedicated = []
    let id = ''
    if (this.state) {
      id = this.state.id
    }
    console.log(this.state)
    if (!this.state.loading && !this.state.error) {
      for (const [index, value] of this.state.lines.entries()) {
        if (index % 2 !== 0) {
          const direction = `${this.state.lines[index - 1].direction},${
            value.direction
          }`
          all.push(
            <li>
              <Link
                to={{
                  pathname: `/line/${value.category}/${value.id}`,
                  query: {
                    name: `${value.name}`,
                    direction: `${direction}`
                  }
                }}
                className={id === value.id ? 'selectLine' : ''}
                onClick={() => this.selectLine(value.id)}
              >
                - {value.id} {value.name} (
                {this.state.lines[index - 1].direction}, {value.direction} )
              </Link>
            </li>
          )
          if (value.category === 'local') {
            local.push(
              <li>
                <Link
                  to={{
                    pathname: `/line/${value.category}/${value.id}`,
                    query: {
                      name: `${value.name}`,
                      direction: `${direction}`
                    }
                  }}
                  className={id === value.id ? 'selectLine' : ''}
                  onClick={() => this.selectLine(value.id)}
                >
                  - {value.id} {value.name} (
                  {this.state.lines[index - 1].direction}, {value.direction} )
                </Link>
              </li>
            )
          } else if (value.category === 'shuttleOr') {
            shuttleOr.push(
              <li>
                <Link
                  to={{
                    pathname: `/line/${value.category}/${value.id}`,
                    query: {
                      name: `${value.name}`,
                      direction: `${direction}`
                    }
                  }}
                  className={id === value.id ? 'selectLine' : ''}
                  onClick={() => this.selectLine(value.id)}
                >
                  - {value.id} {value.name} (
                  {this.state.lines[index - 1].direction}, {value.direction} )
                </Link>
              </li>
            )
          } else if (value.category === 'night') {
            night.push(
              <li>
                <Link
                  to={{
                    pathname: `/line/${value.category}/${value.id}`,
                    query: {
                      name: `${value.name}`,
                      direction: `${direction}`
                    }
                  }}
                  className={id === value.id ? 'selectLine' : ''}
                  onClick={() => this.selectLine(value.id)}
                >
                  - {value.id} {value.name} (
                  {this.state.lines[index - 1].direction}, {value.direction} )
                </Link>
              </li>
            )
          } else if (value.category === 'express') {
            express.push(
              <li>
                <Link
                  to={{
                    pathname: `/line/${value.category}/${value.id}`,
                    query: {
                      name: `${value.name}`,
                      direction: `${direction}`
                    }
                  }}
                  className={id === value.id ? 'selectLine' : ''}
                  onClick={() => this.selectLine(value.id)}
                >
                  - {value.id} {value.name} (
                  {this.state.lines[index - 1].direction}, {value.direction} )
                </Link>
              </li>
            )
          } else {
            dedicated.push(
              <li>
                <Link
                  to={{
                    pathname: `/line/${value.category}/${value.id}`,
                    query: {
                      name: `${value.name}`,
                      direction: `${direction}`
                    }
                  }}
                  className={id === value.id ? 'selectLine' : ''}
                  onClick={() => this.selectLine(value.id)}
                >
                  - {value.id} {value.name} (
                  {this.state.lines[index - 1].direction}, {value.direction} )
                </Link>
              </li>
            )
          }
        }
      }
    }

    return (
      <div>
        <h3>Menu: </h3>
        <Nav vertical>
          <NavItem>
            <DropdownToggle style={{ width: '250px' }} caret id='toggler'>
              Toutes Les Lignes
            </DropdownToggle>
            <UncontrolledCollapse toggler='#toggler'>
              <Card>
                <CardBody>
                  {!this.state.error ? all: this.state.error}
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </NavItem>
          <NavItem>
            <DropdownToggle style={{ width: '250px' }} caret id='reseaulocal'>
              Reseau Local
            </DropdownToggle>
            <UncontrolledCollapse toggler='#reseaulocal'>
              <Card>

                <CardBody>{!this.state.error ? local: this.state.error}</CardBody>
              </Card>
            </UncontrolledCollapse>
          </NavItem>
          <NavItem>
            <DropdownToggle style={{ width: '250px' }} caret id='reseaunuit'>
              Reseau De Nuit
            </DropdownToggle>
            <UncontrolledCollapse toggler='#reseaunuit'>
              <Card>
                <CardBody>{!this.state.error ? night : this.state.error}</CardBody>
              </Card>
            </UncontrolledCollapse>
          </NavItem>
          <NavItem>
            <DropdownToggle style={{ width: '250px' }} caret id='reseauexpress'>
              Reseau Express
            </DropdownToggle>
            <UncontrolledCollapse toggler='#reseauexpress'>
              <Card>
                <CardBody>{!this.state.error ? express : this.state.error}</CardBody>
              </Card>
            </UncontrolledCollapse>
          </NavItem>
          <NavItem>
            <DropdownToggle style={{ width: '250px' }} caret id='navettes'>
              Dedicated
            </DropdownToggle>
            <UncontrolledCollapse toggler='#navettes'>
              <Card>
                <CardBody>{!this.state.error ? dedicated : this.state.error}</CardBody>
              </Card>
            </UncontrolledCollapse>
          </NavItem>
          <NavItem>
            <DropdownToggle style={{ width: '250px' }} caret id='navettesor'>
              Navettes Or
            </DropdownToggle>
            <UncontrolledCollapse toggler='#navettesor'>
              <Card>
                <CardBody>{!this.state.error ? shuttleOr : this.state.error}</CardBody>
              </Card>
            </UncontrolledCollapse>
          </NavItem>
        </Nav>
      </div>
    )
  }
}

export default Sidebar
