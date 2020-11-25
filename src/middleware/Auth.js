const jwt = require('jsonwebtoken');
const db = require('../db');

const Auth = {
  /**
   * Verify Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */
  async verifyToken(req, res, next) {
    console.log(req.body)
    console.log(req.headers)
    const token = req.headers['x-access-token'];
    console.log("Verifying Token");
    if(!token) {
      return res.status(400).send({ 'message': 'Token is not provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(text, [decoded.userId]);
      if(!rows[0]) {
        return res.status(400).send({ 'message': 'The token you provided is invalid' });
      }
      req.user = { id: decoded.userId };
      next();
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async verifyTokenAdmin(req, res, next) {
    console.log(req.body)
    console.log(req.headers)
    const token = req.headers['x-access-token'];
    console.log("Verifying Token");
    if(!token) {
      return res.status(400).send({ 'message': 'Token is not provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(text, [decoded.userId]);
      if(!rows[0] || rows[0].user_type != 'admin') {
        return res.status(400).send({ 'message': 'The token you provided is invalid or you are not admin' });
      }
      req.user = { id: decoded.userId };
      next();
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

module.exports =  Auth;
