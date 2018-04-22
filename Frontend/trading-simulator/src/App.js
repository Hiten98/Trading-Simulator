import React, { Component } from "react";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Main from "./Main";
import Trading from "./Trading";
import Login from "./Login";
import Register from "./Register";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jwt: ""
    };
  }

  verifyJWT = () => {
    if (this.state.jwt == null || this.state.jwt == "") {
      return false;
    } else {
      return true;
    }
  };

  requireAuth = (nextState, replace) => {
    if (!this.verifyJWT()) {
      replace({
        pathname: "/login"
      });
    }
  };

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/profile:jwt" />
          <Route path="/trading/:jwt" component={Trading} />
          <Route path="/graphs/:jwt" />
          <Redirect from="*" to="/login" />
        </Switch>
      </div>
    );
  }
}

export default App;
