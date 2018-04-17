import React, { Component } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Main from "./Main";
import Trading from "./Trading";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/login" />
          <Route path="/profile"/>
          <Route path="/trading" component={Trading} />
          <Route path="/graphs"/>
        </Switch>
      </div>
    );
  }
}

export default App;
