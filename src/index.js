import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Switch } from "react-router-dom";
import Layout from './pages/Layout';
import Schedule from './components/Schedule/Schedule';
import AppRoute from './pages/AppRoute';

ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <AppRoute exact={true} path="/" component={Schedule} layout={Layout} />
        <AppRoute path="/line/:category/:id" component={Schedule} layout={Layout} />
      </Switch>
    </BrowserRouter>,
    document.getElementById("root")
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
