import React from 'react';
import { Row, Col } from 'reactstrap';
import './Layout.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Sidebar from '../components/Sidebar/Sidebar';
import { Container } from 'reactstrap';


export default ({ children }) => (
    <>
    <Container>
    <div>
    <Header />
    </div>
    <div>
    <Row>
        <Col xs="3"><Sidebar /></Col>
        <Col xs="9">{children}</Col>
    </Row>  
    </div>
    <div>
    <Footer />
    </div>
    </Container>
    </>
)