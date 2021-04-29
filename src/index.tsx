import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
// import DataEditor from './vxml/DataEditor'
// import VisualXml from './vxml/VisualXml'
import * as serviceWorker from './serviceWorker';
import Home from './home/Home';
import Vxml from './vxml/VisualXml';
import { Router } from "@reach/router"

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.register();


ReactDOM.render(
  <div style={{ width: "100vw" }}>
    {/* primary=false is to prevent the auto focus from the router scrolling the page */}
    <Router primary={false}>
      <Home path="/" />
      <Home path="/:section" />
      <Home path="/:section/:post" />
      <App path="/app" />
      <Vxml path="/vxml" />
    </Router>
  </div>,
  document.getElementById("root")
)