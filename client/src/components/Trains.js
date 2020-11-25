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
  const[noOfPassengers,setNoOfPassengers]=useState(0);
  const[coach_type,handleCoachChange]=useState("");
  const[train_id,setTrainId]=useState("");
  const [trains, updateTrainArray]=useState([]);
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

      console.log(qs.stringify(requestBody))
      axios.post('http://localhost:5000/api/v1/users/create_ticket', requestBody, config)
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
      setNoOfPassengers(noOfPassengers+1);
    };
    function validateForm(){
      return true;
    }
    function handlePageSwitch(){
      history.push('/bookings',{params:token});
    }
    const expandRow = {
      showExpandColumn: true,
      renderer: row => (
        <div className="App">
      <h3>Book Ticket for train ${row.train_name}</h3>
      <input
      name="coach"
      placeholder="Select Coach- ac/sl"
      value={coach_type}
      onChange={e=>handleCoachChange(e.target.value)}/>

      {inputList.map((x, i) => {
        return (
          <div className="box">
          
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
            <input
              className="ml10"
              name="gender"
              placeholder="Enter M for Male, F for Female"
              value={x.gender}
              onChange={e => handleInputChange(e, i)}
            />
            <div className="btn-box">
              {inputList.length !== 1 && <button
                className="mr10"
                onClick={() => handleRemoveClick(i)}>Remove Passenger</button>}
              {inputList.length - 1 === i && <button onClick={handleAddClick}>Add Passenger</button>}
            </div>
          </div>
        );
      })}
      <button  onClick={row=>handleSubmit(row)} className="btn btn-primary btn-block">
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