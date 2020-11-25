import  Button  from "react-bootstrap/Button";
import  { Component, Fragment,useState } from "react";
import BootstrapTable from 'react-bootstrap-table-next'
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogContent,
} from "@reach/alert-dialog";

var React = require('react');
var ReactDOM = require('react-dom');


const axios = require('axios')
const qs = require('querystring')

  

export default function Trains(){
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
  const [inputList, setInputList] = useState([{ name: "", age: "",gender:"" }]);
  const[noOfPassengers,setNoOfPassengers]=useState(1);
  const[coach_type,handleCoachChange]=useState("");
  const[train_id,setTrainId]=useState("");
  const [trains, updateTrainArray]=useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const close = () => setShowDialog(false);
  const cancelRef = React.useRef();

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

      axios.get('https://railway-reservation-project.herokuapp.com/api/v1/get_all_train?', config)
      .then( (response) => {
        console.log(response)
        
        updateTrainArray((old_train)=>{
          var curr_train = [...old_train];
          for(var i=0;i<response.data.rowCount;i++){
            var obj=new Object();
            obj.train_name= response.data.rows[i].train_name;
            obj.schedule_date= response.data.rows[i].schedule_date;
            obj.ac_coach_count= response.data.rows[i].ac_coach_count;
            obj.sl_coach_count=response.data.rows[i].sl_coach_count;
            obj.train_id=response.data.rows[i].id;
            obj.ac_seat_count_left=response.data.rows[i].ac_seat_count_left;
            obj.sl_seat_count_left=response.data.rows[i].sl_seat_count_left;
            curr_train = [...curr_train,obj]
           }
           return curr_train;

        });
      })
      .catch(err =>{
        console.log(err);
      })

      }

      React.useEffect(()=>{
        getTickets();
    },[]);
    
    const handleSubmit = (row) => {
      const requestBody = {
        train_id: row.train_id,
        number_of_passengers: noOfPassengers,
        coach_type: coach_type,
        passenger: [...inputList]
      }

      console.log(requestBody);
      const config = {
        headers: {
          'x-access-token':token
        }
      }
      axios.post('https://railway-reservation-project.herokuapp.com/api/v1/users/create_ticket', requestBody, config)
      .then(function (response) {
        
          console.log(response);
          if(response.status==400){
            console.log("Server Error");
          }
          else {
            alert("Your ticket has been booked, check it in the booking section");
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
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      clickToExpand: true
    };
    const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...inputList];
      list[index][name] = value;
      setInputList(list);
    };

    const handleAddClick = () => {
      setInputList([...inputList, { name: "", age: "", gender: "" }]);
      setNoOfPassengers(noOfPassengers+1);
    };
    const handleRemoveClick = index => {
      const list = [...inputList];
      list.splice(index, 1);
      setInputList(list);
      setNoOfPassengers(noOfPassengers-1);
    };
    function isNumeric(str) {
      if (typeof str != "string") return false   
      return !isNaN(str) && 
             !isNaN(parseFloat(str)) 
    }
    function validateForm(){
      const list = [...inputList];
      for(var i=0;i<list.length;i++){
        if(!isNumeric(list[i]['age'])){
          return false;
        }
        if(!(/^[a-zA-Z ]+$/.test(list[i]['name']))){
          return false;
        }
        if(list[i]['gender']=="" || coach_type==""){
          return false;
        }
      }
      return true;
    }
    function handlePageSwitch(){
      history.push('/bookings',{params:token});
    }
    function handleLogout(){
      token="";
      history.push('/sign-in');
    }
    const expandRow = {
      showExpandColumn: true,
      renderer: row => (
        <div className="Booking">
      <h3>Book Ticket for train {row.train_name}</h3>
      <select name="coach" id="coach" onChange={e=>handleCoachChange(e)}>
      <option value="ac">Select Coach</option>      
      <option value="ac">AC Coach</option>
      <option value="sl">Sleeper Coach</option>
          </select>

      {inputList.map((x, i) => {
        return (
          <div className="book">
          
            <input
              
              name="name"
              placeholder="Enter Name of Passenger"
              value={x.name}
              onChange={e => handleInputChange(e, i)}
            />
            <input
              className="ml10"
              name="age"
              placeholder="Enter Passenger Age"
              value={x.age}
              onChange={e => handleInputChange(e, i)}
            />
            <select name="gender" id="gender" onChange={e=>handleInputChange(e,i)}>
            <option value="m">Select Gender</option>
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
            <div className="btn-box">
              {inputList.length !== 1 && <Button
                className="mr10 btn"
                onClick={() => handleRemoveClick(i)}>Remove Passenger</Button>}
              {inputList.length - 1 === i && <Button onClick={handleAddClick} className="btn ">Add Passenger</Button>}
            </div>
          </div>
        );
      })}
      <button  disabled={!validateForm()} onClick={() => handleSubmit(row)} className="btn btn-primary btn-block">
      Book Ticket
      </button>
    </div>
      )
    };

    return(
        <div>
        
          <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/sign-in"}>Railway Reservation Project</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Button onClick={handlePageSwitch} className="btn btn-block">Check Bookings</Button>
                
              </li>
              <li>
              <Button onClick={handleLogout} className="btn btn-block">Logout</Button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
        <BootstrapTable keyField='train_name' data={trains} columns={cols} selectRow={ selectRow }
        expandRow={ expandRow } >
      

  </BootstrapTable>
  </div>
    );
}