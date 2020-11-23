const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');

const Admin = {
  /**
   * Add a Train
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object 
   */
  async createTrain(req, res) {

    const createQuery = `INSERT INTO
      trains(id, train_name, ac_coach_count,sl_coach_count,schedule_date,create_date)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`;
    const values = [
      uuid(),
      req.body.train_name,
      req.body.ac_coach_count,
      req.body.sl_coach_count,
      req.body.schedule_date,
      moment(new Date())
    ];

    try {
        const { rows } = await db.query(createQuery, values);
        return res.status(201).send(rows[0]);
      } catch(error) {
        return res.status(400).send(error);
      }
  },

  async getAllTrains(req, res) {
    const findAllQuery = 'SELECT * FROM trains where schedule_date >= NOW()';
    try {
      const { rows, rowCount } = await db.query(findAllQuery, []);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },


}


module.exports = Admin;