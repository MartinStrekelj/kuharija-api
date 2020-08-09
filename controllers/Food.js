const addFood = (req, res, knex) => {
    const { imejedi, tipjedi, postopek, sestavine } = req.body;
    const newDish = {
        jed: imejedi, 
        tip: tipjedi, 
        postopek, 
        sestavine,
        added: new Date()
    }
    knex.insert(newDish).into("food")
    .then(
        response => res.json({
            message: "Nov recept uspešno shranjen!"
        })
    )
    .catch(err => res.status(400).json({
        message: "Napaka pri shranjevanju novega recepta."
    }))
}

const getAll = (req, res, knex) =>{
    knex.select("*").from("food").orderBy("added", "desc")
    .then(food => res.json(food))
    .catch(err => res.status(400).json({
        message: "Error getting food"
    }))
}

const updateFood = (req, res, knex) => {
    const { id, imejedi, tipjedi, postopek, sestavine } = req.body
    knex("food").where("id", "=", id)
    .update({
        jed: imejedi,
        tip: tipjedi, 
        postopek,
        sestavine
    })
    .then(response => res.json({
        message: "Succesfully updated!"
    }))
    .catch(err => res.status(400).json({
        message: err.message
    }))
}

const getFoodById = (req, res, knex) => {
    const {id} = req.params;
    knex.select("*").from("food")
    .where("id", "=", id)
    .then(food => res.status(200).json(food))
    .catch(err => {
    res.status(400).json({
        message: "Error getting food"
    })
})
}

module.exports = {
    addFood: addFood,
    getAll: getAll,
    getFoodById: getFoodById,
    updateFood: updateFood
}