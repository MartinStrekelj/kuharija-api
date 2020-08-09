const express = require("express");
const cors = require ("cors")
const morgan = require ("morgan")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const { signIn, register } = require("./controllers/User");
const { getAll, getFoodById, addFood, updateFood } = require("./controllers/Food");

const knex = require("knex")( {
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
  res.json(knex("users").select("*"))
  }
)
// User
app.post("/signin",
 (req, res) => signIn(req,res, knex, bcrypt, validationResult))
app.post("/register",
 (req, res) => register(req, res, knex, bcrypt, validationResult))

// Food
app.get("/food", (req, res) => getAll(req, res, knex))
app.get("/food/:id", (req, res) => getFoodById(req, res, knex))
app.post("/food", (req, res) => addFood(req, res, knex))
app.put("/food/:id", (req, res) => updateFood(req, res, knex))


const PORT = process.env.PORT || "3005"
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})