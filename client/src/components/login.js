import React, { Component, Fragment,useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
const axios = require('axios')
const qs = require('querystring')
//let output="cfdv"

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    function validateForm() {
        return email.length > 0 && password.length > 0;
      }
    
      function handleSubmit(event) {
        event.preventDefault();
        console.log(email,password);
        const requestBody = {
          email: email,
          password: password
        }
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        axios.post('https://railway-reservation-project.herokuapp.com/api/v1/users/login', qs.stringify(requestBody), config)
        .then(function (response) {
          
            console.log(response);
            if(response.status==400){
              console.log("Invalid Email/Password");
            }
            let token=response.data.token;
            let user_type=response.data.user_type;
            if(user_type=='admin'){
              console.log("Logged in as Admin");
              history.push('/add-train',{params:token});
            }
            else {
              console.log("Logged in as Ticket Booker");
              history.push('/trains',{params:token});
            }
            
        
        })
        .catch(err =>{
          console.log(err);
          if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
          }
        })
      }
    
    
        return (
          <div>
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
              
            
            </ul>
          </div>
        </div>
      </nav>
            <Form onSubmit={handleSubmit}>
                <h3>Sign In</h3>
            <Form.Group size="lg" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </Form.Group>
            <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateForm()} className="btn btn-primary btn-block">
            Login
            </Button>
            </Form>
            </div>
        );
    
}