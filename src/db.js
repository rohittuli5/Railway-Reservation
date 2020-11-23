const Pool = require("pg").Pool;
const dotenv = require('dotenv');

dotenv.config();


const devConfig={
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
}
const proConfig={
  connectionString:process.env.DATABASE_URL,
}
const pool = new Pool(process.env.NODE_ENV==="production"?proConfig:devConfig);

console.log(devConfig);

pool.on('connect', () => {
    console.log('connected to the db');
  });


const createUserTable = () => {
    const queryText =
      `CREATE TABLE IF NOT EXISTS
        users(
          id UUID PRIMARY KEY,
          email VARCHAR(128) UNIQUE NOT NULL,
          password VARCHAR(128) NOT NULL,
          user_type VARCHAR(128) NOT NULL,
          created_date TIMESTAMP,
          modified_date TIMESTAMP
        )`;
  
    pool.query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }


  const createTrainsTable = () => {
    const queryText =
      `CREATE TABLE IF NOT EXISTS
        trains(
          id UUID PRIMARY KEY,
          train_name VARCHAR(128) UNIQUE NOT NULL,
          ac_coach_count INT NOT NULL,
          sl_coach_count INT NOT NULL,
          schedule_date TIMESTAMP,
        )`;
  
    pool.query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }


  const dropUserTable = () => {
    const queryText = 'DROP TABLE IF EXISTS users returning *';
    pool.query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }

  const dropAllTables = () => {
    dropUserTable();
  }

pool.on('remove', () => {
  console.log('client removed');
  //process.exit(0);
});


module.exports = pool;

require('make-runnable');
