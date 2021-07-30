import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import YandexMap from "./components/yandex-map/YandexMap";
import Registration from "./components/registration/Registration";
import Authorization from "./components/authorization/Authorization";

export const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route path="/map" component={YandexMap} />
        <Route path="/registration" component={Registration} />
        <Route path="/autorization" component={Authorization} />
      </Switch>

      {localStorage.getItem("user") ? (
        <Switch>
          <Redirect to="/map" />
        </Switch>
      ) : window.location.href ===
        "http://localhost:3000/autorization" ? null : window.location.href ===
        "http://localhost:3000/registration" ? null : (
        <Redirect from="/" to="/autorization" />
      )}
    </div>
  );
}
