import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import DataEditor from './editor/DataEditor'
import VisualXml from './vxml/VisualXml'
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './home/Home';
import Cv from './cv/Cv';

ReactDOM.render(
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

function AppRouter() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/app" component={App} />
        <Route path="/data" component={DataEditor} />
        <Route path="/resume" component={Cv} />
        <Route path="/cv" component={Cv} />
        <Route path="/vxml" component={VisualXml} />
      </Switch>
    </main>
  )
}