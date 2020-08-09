const express = require("express");
const cors = require ("cors")
const morgan = require ("morgan")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const knex = require("knex")
const { signIn, register } = require("./controllers/User");
const { getAll, getFoodById, addFood, updateFood } = require("./controllers/Food");

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const db = knex( {
  client: "pg",
  connection: {
    connectString: process.env.DATABASE_URL,
    ssl:true,
  }
});

const app = express();
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny"));

// Endpoints
app.get("/", (req,res) => {
  res.json({
    message: "Server connected!",
    db_url: process.env.DATABASE_URL
  })
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