import React, { createContext } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { App } from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import Store from "./store/store";

const store = new Store();

export const Context = createContext({
  store,
});

ReactDOM.render(
  <Router>
    <Context.Provider
      value={{
        store,
      }}
    >
      <App />
    </Context.Provider>
  </Router>,
  document.getElementById("root")
);
