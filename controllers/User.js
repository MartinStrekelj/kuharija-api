
const saltRounds = 10;

const signIn = (req, res, knex, bcrypt) => {
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
}

const register = (req, res, knex, bcrypt) => {
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
}

module.exports = {
    signIn: signIn,
    register: register
}