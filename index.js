const express = require("express");
const cors = require ("cors")
const morgan = require ("morgan")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const knex = require("knex")
const { body, validationResult } = require('express-validator');
const { signIn, register } = require("./controllers/User");
const { getAll, getFoodById, addFood, updateFood } = require("./controllers/Food");

const db = knex( {
  client: "pg",
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny"));

// Endpoints
app.get("/", (req,res) => {
  res.json(db("users").select("*"))
  }
)
// User
app.post("/signin",
 (req, res) => signIn(req,res, db, bcrypt))
app.post("/register",
 (req, res) => register(req, res, db, bcrypt))

// Food
app.get("/food", (req, res) => getAll(req, res, db))
app.get("/food/:id", (req, res) => getFoodById(req, res, db))
app.post("/food", (req, res) => addFood(req, res, db))
app.put("/food/:id", (req, res) => updateFood(req, res, db))


const PORT = process.env.PORT || "3005"
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})