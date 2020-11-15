import React, { Fragment, useState } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
//components

import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";
const axios = require('axios')
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(email,password);
    

    axios.post('https://railway-reservation-project.herokuapp.com/api/v1/users/login', {
      email: email,
      password: password
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(err =>{
      console.log(err);
    })
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
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
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
}
