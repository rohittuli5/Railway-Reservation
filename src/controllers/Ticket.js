const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');
const format = require('pg-format');


const Ticket = {
  /**
   * Add a Ticket
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object 
   */
  async createTicket(req, res) {

    const myId = req.user.id;
    const trainId = req.body.train_id;
    const numberOfPassengers = req.body.number_of_passengers;
    const coachType = req.body.coach_type;
    const passenger = req.body.passenger;

    console.log(req.body)


    if (!myId || !trainId || !numberOfPassengers || !coachType) {
      return res.status(400).send({'message': 'Some values are missing'});
    }

    const checkTrainStatus = `SELECT * FROM train_status WHERE train_id = $1`;
    const trainValues = [trainId];


    

    try {
        const { rows } = await db.query(checkTrainStatus, trainValues);
        if (!rows[0]) {
            return res.status(400).send({'message': 'Train not found in train_status'});
        }
        
        const train_status = rows[0];
        var availableSeats = 0;
        var ticketValue = {};
        var updateCoach = 'sl';

        if(coachType == 'ac'){
            updateCoach = 'ac';
            availableSeats = train_status.ac_seat_count_left;
        }else{
            availableSeats = train_status.sl_seat_count_left;
        }


        const createTicketQuery = `INSERT INTO
          tickets(id, number_of_passengers, booked_by,train_id,status,created_date)
          VALUES($1, $2, $3, $4, $5, $6)
          returning *`;


        if(availableSeats >= numberOfPassengers){
          
        const createTicketValues = [
            uuid(),
            numberOfPassengers,
            myId,
            trainId,
            "Success",
            moment(new Date())
          ];

          ticketValue = await db.query(createTicketQuery, createTicketValues);


          const createPassengersQuery = `INSERT INTO
          passengers(id, ticket_id, train_id,passenger_name,age,gender,seat_number,coach_number)
          VALUES %L
          returning *`;

          var passengersArray = [];
          passenger.forEach(function(item) {
            passengersArray.push([
              uuid(),
              createTicketValues[0],
              createTicketValues[3],
              item.name,
              parseInt(item.age,10),
              item.gender,
              10,
              10
            ]);
          });

          const final_passenger_query = format(createPassengersQuery,passengersArray);
          const passengersListINSERTED = await db.query(final_passenger_query);
          console.log(passengersListINSERTED.rows);

          const updateTrainStatusQuery = `UPDATE train_status SET `+updateCoach+`_seat_count_left = $1 WHERE train_id = $2 returning *;`;

          const trainStatusUpdated = await db.query(updateTrainStatusQuery, [
            availableSeats - numberOfPassengers,
            trainId
          ]);

        }else{

          const createTicketValues = [
            uuid(),
            numberOfPassengers,
            myId,
            trainId,
            "Failed",
            moment(new Date())
          ];

          ticketValue = await db.query(createTicketQuery, createTicketValues);

        }

        return res.status(201).send(ticketValue.rows[0]);
      } catch(error) {
        return res.status(400).send(error);
      }
  },

  async getAllTickets(req, res) {
    const findAllQuery = 'SELECT * FROM tickets where id = $1';
    try {
      const { rows, rowCount } = await db.query(findAllQuery, [req.user.id]);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },


}


module.exports = Ticket;