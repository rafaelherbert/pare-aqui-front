import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Cadastro from "./pages/Cadastro.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import UserManager from "./UserManager.js";

export default function App() {
    return (
        <div>
            <Router>
                <Switch>
                    <Route path="/logout" render={() => {
                        UserManager.clearUser();
                        return <Redirect to="/login" />;
                    }}/>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/register">
                        <Cadastro />
                    </Route>
                    <PrivateRoute path="/">
                        <Home />
                    </PrivateRoute>
                </Switch>
            </Router>
        </div>
    );
}


function PrivateRoute({ children, ...rest }) {
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