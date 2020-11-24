const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');

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
        var ticketStatus = "Failed";

        console.log(train_status);

        if(coachType == 'ac'){
            availableSeats = train_status.ac_seat_count_left;
        }else{
            availableSeats = train_status.sl_seat_count_left;
        }
        if(availableSeats >= numberOfPassengers){
            // update seats and add passenger
            ticketStatus = "Success"
        }else{

        }

        const createTicketQuery = `INSERT INTO
          tickets(id, number_of_passengers, booked_by,train_id,status,created_date)
          VALUES($1, $2, $3, $4, $5, $6)
          returning *`;
        const createTicketValues = [
            uuid(),
            numberOfPassengers,
            myId,
            trainId,
            ticketStatus,
            moment(new Date())
          ];

        console.log("sucess ",createTicketValues);

        const ticketValue = await db.query(createTicketQuery, createTicketValues);
        console.log(ticketValue);

        return res.status(201).send(ticketValue.rows[0]);
      } catch(error) {
        console.log("err ",error)
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