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
function App() {

  return (<Router>
    <div className="App">
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/sign-in"}>Railway Reservation Project</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-in"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/trains"}>Book Journey</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/add-train"}>Add Trains</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/trains" component={Trains} />
            <Route path="/add-train" component={AddTrain}/>
          </Switch>
        </div>
      </div>
    
    </div>
    </Router>
  );
}
export default App;