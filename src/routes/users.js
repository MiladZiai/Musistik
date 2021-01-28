const express = require('express')
const router = express.Router()
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')

router.get('/', (req, res) => {
    errors = []
    db.getAllUsers(function(error, users){
        if(error) {
            errors.push("Could not load users, please try again later!")
            res.render("users.hbs", {errors, errors})
        } else {
            const model = {
                users: users,
                isLoggedIn: req.session.isLoggedIn
            }
            res.render("users.hbs", model)
        }
    })
})


module.exports = router