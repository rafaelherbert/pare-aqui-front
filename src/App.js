import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Cadastro from "./pages/Cadastro.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Landing from './pages/Landing.jsx';
import Lots from './pages/Lots.jsx';
import LotHistory from './pages/LotHistory.jsx';
import UserManager from "./UserManager.js";
import React from "react";
import "./App.css";

export default function App() {
  return (
    <div className="d-flex flex-column h-100">

      <header>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container-fluid">
            <a href="/" className="navbar-brand d-flex align-items-center">
              <strong>{process.env.REACT_APP_NAME}</strong>
            </a>
            <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse collapse" id="navbarCollapse">
              <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                  <a className="nav-link" aria-current="page" href="/">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" aria-current="page" href="/lots">Vagas</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-shrink-0 py-3">
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
      </main>

      <footer className="footer mt-auto py-3 bg-light">
        <div className="container">
          <span className="text-muted">Esse trabalho foi desenvolvido para a matéria TCC00340 - Desenvolvimento de Aplicações Corporativas - 2020/2.</span>
        </div>
      </footer>
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