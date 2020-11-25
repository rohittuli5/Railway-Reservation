const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');
const format = require('pg-format');

const acBerthCount = 18;
const slBerthCount = 24;
const birthType = ['NONE','LB','UB','SL','SU','MB'];
const acBerthTypes = [0,1,1,2,2,3,4,1,1,2,2,3,4,1,1,2,2,3,4];
const slBerthTypes = [0,1,5,2,1,5,2,3,4,1,5,2,1,5,2,3,4,1,5,2,1,5,2,3,4];


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


    if (!myId || !trainId || !numberOfPassengers || !coachType || passenger.length != numberOfPassengers) {
      return res.status(400).send({'message': 'Some values are missing or passenger lenght != number of passengers'});
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
        var coachTotalCount = 0;

        if(coachType == 'ac'){
            updateCoach = 'ac';
            coachTotalCount = acBerthCount;
            availableSeats = train_status.ac_seat_count_left;
        }else{
            coachTotalCount = slBerthCount;
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
          passengers(id, ticket_id, train_id,passenger_name,age,gender,seat_number,coach_number,coach_type)
          VALUES %L
          returning *`;

          var passengersArray = [];
          var currPass = 0;
          passenger.forEach(function(item) {
            var seatAlloted = ((availableSeats-currPass)%coachTotalCount);
            var coachNumber = Math.floor((availableSeats-currPass)/coachTotalCount);
            if(seatAlloted == 0){
              coachNumber = coachNumber - 1;
              seatAlloted = coachTotalCount;
            }
            passengersArray.push([
              uuid(),
              createTicketValues[0],
              createTicketValues[3],
              item.name,
              parseInt(item.age,10),
              item.gender,
              seatAlloted,
              coachNumber,
              updateCoach+'/'+birthType[(updateCoach=='ac') ?  acBerthTypes[seatAlloted] : slBerthTypes[seatAlloted]]
            ]);
            currPass = currPass + 1;
          });

          const final_passenger_query = format(createPassengersQuery,passengersArray);
          const passengersListINSERTED = await db.query(final_passenger_query);
          console.log(passengersListINSERTED.rows);

          const updateTrainStatusQuery = `UPDATE train_status SET `+updateCoach+`_seat_count_left = $1, modified_date = $2 WHERE train_id = $3 returning *;`;

          const trainStatusUpdated = await db.query(updateTrainStatusQuery, [
            availableSeats - numberOfPassengers,
            moment(new Date()),
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
    const findAllQuery = 'SELECT tickets.*, trains.train_name, trains.schedule_date FROM tickets INNER JOIN trains ON trains.id = tickets.train_id where booked_by = $1';
    try {
      const { rows, rowCount } = await db.query(findAllQuery, [req.user.id]);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getAllPassengerByTicket(req, res) {
    console.log(req.body)
    const findAllQuery = 'SELECT * FROM passengers where ticket_id = $1';
    console.log(req.body.ticket_id);
    try {
      const { rows, rowCount } = await db.query(findAllQuery, [req.headers['ticket_id']]);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getAllPassengerByTrain(req, res) {
    const findAllQuery = 'SELECT * FROM passengers where train_id = $1';
    try {
      const { rows, rowCount } = await db.query(findAllQuery, [req.headers['train_id']]);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
}

module.exports = Ticket;