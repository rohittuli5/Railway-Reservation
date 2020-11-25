import  Button  from "react-bootstrap/Button";
import  { Component, Fragment,useState } from "react";
import BootstrapTable from 'react-bootstrap-table-next'
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
var React = require('react');
var ReactDOM = require('react-dom');


const axios = require('axios')
const qs = require('querystring')
var token="";
export default function PassengerList(){
  const location = useLocation();
  const history = useHistory();
  if(!location.state){
    history.push('/sign-in');
  }
  
  if(location.state){
  token = location.state.params;
  }
  console.log(token);
    const [tickets, updateTicketArray]=useState([]);
    const [passengers, updatePassengerArray]=useState([]);
    function handleLogout(){
      token="";
      history.push('/sign-in');
    }
      const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-access-token': token
          }
        }
        const cols = [{
            dataField: 'train_name',
            text: 'Train Name'
          }, {
            dataField: 'schedule_date',
            text: 'Date and Time'
          }, {
            dataField: 'ac_coach_count',
            text: 'AC Coaches'
          },{
            dataField: 'sl_coach_count',
            text: 'Sleeper Coaches'
          },
          {
            dataField: 'train_id',
            text: 'Train ID'
          },
          {
            dataField: 'ac_seat_count_left',
            text: 'AC Seats Remaining'
          },
          {
            dataField: 'sl_seat_count_left',
            text: 'Sleeper Seats Remaining'
          }
        ];
    
  
        const getTickets = () => {
  
        axios.get('https://railway-reservation-project.herokuapp.com/api/v1/get_all_train', config)
        .then( (response) => {
          console.log(response)
          
          updateTicketArray((old_ticket)=>{
            var curr_ticket = [...old_ticket];
            for(var i=0;i<response.data.rowCount;i++){
              var obj=new Object();
              obj.train_name= response.data.rows[i].train_name;
            obj.schedule_date= response.data.rows[i].schedule_date;
            obj.ac_coach_count= response.data.rows[i].ac_coach_count;
            obj.sl_coach_count=response.data.rows[i].sl_coach_count;
            obj.train_id=response.data.rows[i].id;
            obj.ac_seat_count_left=response.data.rows[i].ac_seat_count_left;
            obj.sl_seat_count_left=response.data.rows[i].sl_seat_count_left;
              curr_ticket = [...curr_ticket,obj]
             }
             return curr_ticket;
  
          });
        })
        .catch(err =>{
          console.log(err);
        })
  
        }
  
        React.useEffect(()=>{
          getTickets();
      },[]);
      
      
        
      function validateForm(){
        return true;
      }
     
    function handlePageSwitch(){
      history.push('/add-train',{params:token});
    }

      const expandRow = {
        showExpandColumn: true,
        
        renderer:  (row) => {
          //getPassengers(row.ticket_id);
          return (
          <div className="App">
          <TrainsDetails ticket_id ={row.ticket_id}/>
          
          </div>
         )
        },
        
      };
  
      return(
          <div>
          <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/sign-in"}>Railway Reservation Project</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Button onClick={handlePageSwitch} className="btn btn-block">Add Trains</Button>
              </li>
              <li>
              <Button onClick={handleLogout} className="btn btn-block">Logout</Button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
          <BootstrapTable keyField='ticket_id' data={tickets} columns={cols} 
          expandRow={ expandRow } options={{onExpand :(row)=>{}}}>
        
  
    </BootstrapTable>
    </div>
      );
  }


   const  TrainsDetails = (props) => {
  
    const [passengers, updatePassengerArray]=useState([]);

    const passenger_cols = [{
      dataField: 'passenger_name',
      text: 'Name of Passenger'
    }, {
      dataField: 'age',
      text: 'Age'
    }, {
      dataField: 'gender',
      text: 'Gender'
    },{
      dataField: 'seat_number',
      text: 'Seat No'
    },
    {
      dataField: 'coach_number',
      text: 'Coach No'
    },
    {
        dataField: 'coach_type',
        text: 'Coach Type'
      }
  ];
  
      const getPassengers = (ticket_id) => {

        axios(
          {
            method : 'get',
            url : 'https://railway-reservation-project.herokuapp.com/api/v1/users/get_all_passenger_by_train',
            headers: {
              'x-access-token': token,
              'ticket_id' : ticket_id
            },
          }
      )
        .then( (response) => {
          console.log(response)
          
          updatePassengerArray((old_passengers_list)=>{
            var curr_passengers_list = [...old_passengers_list];
            for(var i=0;i<response.data.rowCount;i++){
              var obj=new Object();
              //obj.train_id= response.data.rows[i].train_id;
              //obj.ticket_id= response.data.rows[i].ticket_id;
              obj.passenger_id= response.data.rows[i].id;
              obj.passenger_name= response.data.rows[i].passenger_name;
              obj.age= response.data.rows[i].age;
              obj.gender=response.data.rows[i].gender;
              obj.seat_number=response.data.rows[i].seat_number;
              obj.coach_number=response.data.rows[i].coach_number;
              obj.coach_type=response.data.rows[i].coach_type;
              curr_passengers_list = [...curr_passengers_list,obj]
             }
             return curr_passengers_list;
  
          });
        })
        .catch(err =>{
          console.log(err);
        })
  
        } 

        React.useEffect(()=>{
          getPassengers(props.ticket_id);
      },[]);
  
      return(
        <BootstrapTable keyField='passenger_id' data={passengers} columns={passenger_cols} >
        </BootstrapTable>
      );
  }