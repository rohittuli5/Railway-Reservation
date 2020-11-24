import  React, { Component, Fragment,useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DateTimePicker from 'react-datetime-picker';
const axios = require('axios')
const qs = require('querystring')
const moment=require('moment')
export default function AddTrains(){
    const [train_name, setTrainName] = useState("");
    const [sl_coach_count, setSlCoachCount] = useState(0);
    const [ac_coach_count, setAcCoachCount] = useState(0);
    const [date_time, onChangeDateTime] = useState(new Date());


    function checkPermission(){
        return true;
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
            'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMTBkNTE4NC03MzNlLTRkYjEtYWU4Mi0xYzQ5ODk1YzRmYjIiLCJpYXQiOjE2MDYxNDA4NDMsImV4cCI6MTYwNjc0NTY0M30.gUaiUNS3ZXIJGgVxIHGf-OLNu1U0mSzJtFwi0DJgR3c'
          }
        }
        axios.post('https://railway-reservation-project.herokuapp.com/api/v1/admin/create_train', qs.stringify(requestBody), config)
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
    );


}