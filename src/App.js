import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Cadastro from "./pages/Cadastro.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Landing from './pages/Landing.jsx';
import Lots from './pages/Lots.jsx';
import LotHistory from './pages/LotHistory.jsx';
import UserManager from "./UserManager.js";
import React from "react";

export default function App() {
  return (
    <div className="container">
      <Router>
        <Switch>
          <Route path="/logout" render={() => {
            UserManager.clearUser();
            return <Redirect to="/login" />;
          }} />
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Cadastro} exact />
          <PrivateRoute path="/home" exact>
            <Home></Home>
          </PrivateRoute>
          <PrivateRoute path="/lots" exact>
            <Lots></Lots>
          </PrivateRoute>
          <PrivateRoute path="/lots/history" exact>
            <LotHistory></LotHistory>
          </PrivateRoute>
          <Route path="/" render={() => {
            if (UserManager.isUserLoggedIn()) return <Redirect to="/home" />;
            else return <Landing />;
          }} />
        </Switch>
      </Router>
    </div>
  );
}

function PrivateRoute({ children = null, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        UserManager.isUserLoggedIn() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}