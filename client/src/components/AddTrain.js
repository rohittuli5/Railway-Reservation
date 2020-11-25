import  React, { Component, Fragment,useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DateTimePicker from 'react-datetime-picker';
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
const axios = require('axios')
const qs = require('querystring')
const moment=require('moment')
export default function AddTrains(){
    const location = useLocation();
    const history = useHistory();
    if(!location.state){
      history.push('/sign-in');
    }
    var token="";
    if(location.state){
    token = location.state.params;
    }
    console.log(token);
    
    const [train_name, setTrainName] = useState("");
    const [sl_coach_count, setSlCoachCount] = useState(0);
    const [ac_coach_count, setAcCoachCount] = useState(0);
    const [date_time, onChangeDateTime] = useState(new Date());


    function checkPermission(){
        return true;
    }
    function handleLogout(){
      token="";
      history.push('/sign-in');
    }
    function handlePageSwitch(){
      history.push('/passenger-list',{params:token});
    }
    function handleSubmit(event) {
        event.preventDefault();
        const requestBody = {
          train_name: train_name,
          ac_coach_count: ac_coach_count,
          sl_coach_count: sl_coach_count,
          schedule_date: moment(date_time).format('YYYY-MM-DD HH:mm:ss')
        }
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-access-token': token
          }
        }
        axios.post('https://railway-reservation-project.herokuapp.com/api/v1/admin/create_train', qs.stringify(requestBody), config)
        .then(function (response) {
          
            console.log(response);
            if(response.status==400){
              console.log("Server Error");
              alert("An Error Occoured");
            }
            else{
              alert("Train Successfully Added");
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
            <li>
            <Button onClick={handlePageSwitch} className="btn btn-block">Check Passenger List</Button>
            </li>
              <li>
              <Button onClick={handleLogout} className="btn btn-block">Logout</Button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
        <Form onSubmit={handleSubmit}>
            <h3>Add Train</h3>
        <Form.Group size="lg" controlId="train-name">
        <Form.Label>Train Name</Form.Label>
        <Form.Control
            autoFocus
            type="train-name"
            value={train_name}
            onChange={(e) => setTrainName(e.target.value)}
        />
        </Form.Group>
        <Form.Group size="lg" controlId="sl-coach-count">
        <Form.Label>Sleeper Coach Count</Form.Label>
        <Form.Control
            type="sl-coach-count"
            value={sl_coach_count}
            onChange={(e) => setSlCoachCount(e.target.value)}
        />
        </Form.Group>
        
        <Form.Group size="lg" controlId="ac-coach-count">
        <Form.Label>AC Coach Count</Form.Label>
        <Form.Control
            type="ac-coach-count"
            value={ac_coach_count}
            onChange={(e) => setAcCoachCount(e.target.value)}
        />
        </Form.Group>
        <DateTimePicker
        onChange={onChangeDateTime}
        value={date_time}
      />

        <Button block size="lg" type="submit" disabled={!checkPermission()} className="btn btn-primary btn-block">
        Add Train
        </Button>
        </Form>
        </div>
    );

    
}