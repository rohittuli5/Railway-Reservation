var React = require('react');
var ReactDOM = require('react-dom');
var ReactBsTable  = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
const axios = require('axios')
const qs = require('querystring')

  

export default function Trains(){
    const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMTBkNTE4NC03MzNlLTRkYjEtYWU4Mi0xYzQ5ODk1YzRmYjIiLCJpYXQiOjE2MDYxNDA4NDMsImV4cCI6MTYwNjc0NTY0M30.gUaiUNS3ZXIJGgVxIHGf-OLNu1U0mSzJtFwi0DJgR3c'
        }
      }
    
      var trains = [
    
    ];
      axios.get('https://railway-reservation-project.herokuapp.com/api/v1/get_all_train?', config)
      .then(function (response) {
        //console.log(response)
        let len=response.data.rowCount;
        for(var i=0;i<len;i++){
            var obj=new Object();
            obj.train_name=response.data.rows[i].train_name;
            obj.schedule_date=response.data.rows[i].schedule_date;
            obj.ac_coach_count=response.data.rows[i].ac_coach_count;
            obj.sl_coach_count=response.data.rows[i].sl_coach_count;
            //console.log(obj);
            trains.push(obj);
        }
        //console.log(trains);
      })
      .catch(err =>{
        console.log(err);
      })
    
    
    return(

        <BootstrapTable data={trains} striped hover>
      <TableHeaderColumn isKey dataField='train_name'>Train Name</TableHeaderColumn>
      <TableHeaderColumn dataField='schedule_date'>Date</TableHeaderColumn>
      <TableHeaderColumn dataField='ac_coach_count'>AC Coach Count</TableHeaderColumn>
      <TableHeaderColumn dataField='sl_coach_count'>Sleeper Coach Count</TableHeaderColumn>
  </BootstrapTable>
    );
}