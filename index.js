const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./src/db.js");
const PORT =process.env.PORT||5000;
const path=require("path");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');


const  UserWithDb = require('./src/controllers/User.js');
const  Auth = require('./src/middleware/Auth.js');

dotenv.config();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//middleware
app.use(cors());
app.use(express.json()); //req.body

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"client/build")));
}
console.log(__dirname);
//ROUTES//



app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


app.post('/api/v1/users/login',UserWithDb.login);  // email , password
app.post('/api/v1/users/create', UserWithDb.create);  // email , password




app.get("*",(req,res)=>{
  if(process.env.NODE_ENV==="production"){
    res.sendFile(path.join(__dirname,"client/build/index.html"));
  }
});


app.listen(PORT, () => {
  console.log('server has started on port ${PORT}');
});



//create a todo

// app.post("/todos", async (req, res) => {
//   try {
//     const { description } = req.body;
//     const newTodo = await pool.query(
//       "INSERT INTO todo (description) VALUES($1) RETURNING *",
//       [description]
//     );

//     res.json(newTodo.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //get all todos

// app.get("/todos", async (req, res) => {
//   try {
//     const allTodos = await pool.query("SELECT * FROM hello");
//     res.json(allTodos.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //get a todo

// app.get("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
//       id
//     ]);

//     res.json(todo.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //update a todo

// app.put("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { description } = req.body;
//     const updateTodo = await pool.query(
//       "UPDATE todo SET description = $1 WHERE todo_id = $2",
//       [description, id]
//     );

//     res.json("Todo was updated!");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //delete a todo

// app.delete("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
//       id
//     ]);
//     res.json("Todo was deleted!");
//   } catch (err) {
//     console.log(err.message);
//   }
// });

