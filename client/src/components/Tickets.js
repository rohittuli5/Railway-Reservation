import { Button } from "bootstrap";
import  { Component, Fragment,useState } from "react";
import BootstrapTable from 'react-bootstrap-table-next'
var React = require('react');
var ReactDOM = require('react-dom');


const axios = require('axios')
const qs = require('querystring')

export default function Trains(){
    
    const [tickets, updateTicketArray]=useState([]);
      const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMTBkNTE4NC03MzNlLTRkYjEtYWU4Mi0xYzQ5ODk1YzRmYjIiLCJpYXQiOjE2MDYxNDA4NDMsImV4cCI6MTYwNjc0NTY0M30.gUaiUNS3ZXIJGgVxIHGf-OLNu1U0mSzJtFwi0DJgR3c'
          }
        }
        const cols = [{
          dataField: 'train_id',
          text: 'Train ID'
        }, {
          dataField: 'number_of_passengers',
          text: 'No. of Passengers'
        }, {
          dataField: 'status',
          text: 'Booking Status'
        },{
          dataField: 'journey_date',
          text: 'Journey Date'
        },
        {
          dataField: 'booking_date',
          text: 'Booking Date'
        },
        {
            dataField: 'ticket_id',
            text: 'Ticket ID'
          }
      ];
  
        
  
        const getTickets = () => {
  
        axios.get('https://railway-reservation-project.herokuapp.com/api/v1/users/get_all_my_tickets', config)
        .then( (response) => {
          console.log(response)
          
          updateTicketArray((old_ticket)=>{
            var curr_ticket = [...old_ticket];
            for(var i=0;i<response.data.rowCount;i++){
              var obj=new Object();
              obj.train_id= response.data.rows[i].train_id;
              obj.booking_date= response.data.rows[i].created_date;
              obj.number_of_passengers= response.data.rows[i].number_of_passengers;
              obj.status=response.data.rows[i].status;
              obj.ticket_id=response.data.rows[i].id;
              obj.journey_date=response.data.rows[i].journey_date;
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
  
      const expandRow = {
        showExpandColumn: true,
        renderer: row => (
          <div className="App">
        <p>Hello</p>
      </div>
        )
      };
  
      return(
          <div>
          
          <BootstrapTable keyField='ticket_id' data={tickets} columns={cols} 
          expandRow={ expandRow } >
        
  
    </BootstrapTable>
    </div>
      );
  }