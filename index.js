const express = require("express");
const cors = require ("cors")
const morgan = require ("morgan")
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { response } = require("express");
const knex = require("knex")( {
    client: "pg",
    connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'kuharija'
    }
  });

const saltRounds = 10;
const app = express();
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Endpoints
app.get("/", (req, res) =>{
    res.json({
        message: "Hey it's working!"
    })
})

app.post("/signin", (req, res) => {
    const  { username , password } = req.body;
    knex.select("*").from("login").where({username})
    .then(login => {
        if (bcrypt.compareSync(password, login[0].password)){
            knex.select("*").from("users").where({username})
            .then(user => res.json(user[0]));
        } else {
            res.status(400).json({
                message: "Wrong password!"
            })
        }
    })
    .catch(err => res.status(400).json({
        message: "User does not exist"
    }))
})

app.post("/register", (req, res) => {
    const { username , email, password} = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    knex.transaction(trx => {
        trx.insert({
            username,
            password: hash
        }).into("login").returning("username")
        .then(loginUsername => {
            trx.insert({
                username: loginUsername[0],
                email,
                role: "user"
            }).into("users")
            .returning("*")
            .then(user => {
                return res.json({
                    message: `User ${user[0].username} succesfully registered!`
                })
            })
            .then(trx.commit)
        })
        .catch(trx.rollback)
    }).catch(err => res.status(400).json({
        message: "Unable to register with those credentials"
    }))
})

app.post("/food", (req, res) => {
    const { imejedi, tipjedi, postopek, sestavine } = req.body;
    const newDish = {
        jed: imejedi, 
        tip: tipjedi, 
        postopek, 
        sestavine,
        added: new Date()
    }
    console.log(newDish)
    knex.insert(newDish).into("food")
    .then(
        response => res.json({
            message: "Nov recept uspešno shranjen!"
        })
    )
    .catch(err => res.status(400).json(err))
})

app.put("/food/:id", (req, res) => {
    const { id, imeJedi, tipJedi, postopek, sestavine } = req.body
    knex("food").where("id", "=", id)
    .update({
        imeJedi, tipJedi, postopek, sestavine
    })
    .then(response => res.json({
        message: "Succesfully updated!"
    }))
    .catch(err => res.status(400).json({
        message: "Error with updating"
    }))
})

app.get("/food", (req, res) => {
    knex.select("*").from("food").orderBy("added", "desc")
    .then(food => res.json(food))
    .catch(err => res.status(400).json({
        message: "Error getting food"
    }))
})

app.get("/food/:id", (req, res) => {
    const {id} = req.params;
    knex.select("*").from("food")
    .where("id", "=", id)
    .orderBy("added", "desc")
    .then(food => res.status(200).json(food))
    .catch(err => {
    res.status(400).json({
        message: "Error getting food"
    })
})
})

const PORT = process.env.PORT || "3005"
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})