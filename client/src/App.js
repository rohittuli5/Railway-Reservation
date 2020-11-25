import React, { Fragment, useState } from "react";
import './bootstrap.min.css';
import "./App.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
//components
import Login from "./components/login";
import SignUp from "./components/signup";
import Trains from "./components/Trains"
import AddTrain from "./components/AddTrain"
import Tickets from "./components/Tickets"
import PassengerList from "./components/PassengerList"
function App() {

  return (<Router>
    <div className="App">
    
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/trains" component={Trains} />
            <Route path="/add-train" component={AddTrain}/>
            <Route path="/bookings" component={Tickets}/>
            <Route path="/passenger-list" component={PassengerList}/>
          </Switch>
        </div>
      </div>
    
    </div>
    </Router>
  );
}
export default App;