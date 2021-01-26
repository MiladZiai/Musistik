const express = require('express')
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')
const bcrypt = require('bcryptjs')
const router = express.Router()

router.get('/', (req, res) => {
    res.render("signIn.hbs")
})

router.post('/', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const errors = []

    if(errors.length < 1) {
        db.signIn(username, function(error, user) {
            if(typeof user === "undefined") {
                errors.push("Wrong Username and/or Password 1")
                res.render("signIn.hbs", {errors: errors})
            } else if(error){
                errors.push("Error signing in, please try again later!")
                res.render("signIn.hbs", {errors: errors})
            } else {
                bcrypt.compare(password, user.password, function(err, result){
                    if(result == true) {
                        req.session.isLoggedIn = true
                        req.session.userId = user.id
                        res.render("home.hbs", {isLoggedIn: req.session.isLoggedIn})
                    } else if(err) {
                        errors.push("Wrong Username and/or Password 2")
                        res.render("signIn.hbs", {errors: errors})
                    }
                })
            }
        })
    }
})


module.exports = router