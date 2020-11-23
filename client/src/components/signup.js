import React, { Component, Fragment,useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
const axios = require('axios')
const qs = require('querystring')
export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [card_no, setCardNo] = useState("");
    const [address, setAddress] = useState("");
    function validateForm() {
        if(email.length > 0 && password.length > 0 && name.length>0 && card_no.length==16){
            return true;
        }
        else return false;
    }
    function handleSubmit(event) {
        event.preventDefault();
        console.log(email,password);
        const requestBody = {
          email: email,
          password: password,
          credit_card: card_no,
          address: address
        }
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        axios.post('https://railway-reservation-project.herokuapp.com/api/v1/users/create', qs.stringify(requestBody), config)
        .then(function (response) {
          
            console.log(response);
            if(response.status==400){
              console.log("Server Error");
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
            <Form onSubmit={handleSubmit}>
                <h3>Sign Up</h3>

                <Form.Group size="lg" controlId="Name">
            <Form.Label>Enter Name</Form.Label>
            <Form.Control
                autoFocus
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            </Form.Group>
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
            <Form.Group size="lg" controlId="card-no">
            <Form.Label>Card No</Form.Label>
            <Form.Control
                autoFocus
                type="card-no"
                value={card_no}
                onChange={(e) => setCardNo(e.target.value)}
            />
            </Form.Group>

            <Form.Group size="lg" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
                autoFocus
                type="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateForm()} className="btn btn-primary btn-block">
            Sign Up
            </Button>
                
            <p className="forgot-password text-right">
                Already registered <a href="#">sign in?</a>
            </p>
            </Form>
        );
    
}