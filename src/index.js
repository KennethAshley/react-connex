import React from 'react';
import { render } from "react-dom";
import ConnexProvider from "./lib";

import App from './App';

render(
  <ConnexProvider
    loading="Loading..."
    error={(err) => `Connection error: ${err.message}`}>
    <App />
  </ConnexProvider>,
  document.getElementById("root")
);
