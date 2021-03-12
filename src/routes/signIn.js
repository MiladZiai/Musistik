const express = require('express')
const db = require('../../db')
const bcrypt = require('bcryptjs')
const router = express.Router()

router.get('/', (req, res) => {
    res.render("signIn.hbs")
})

router.post('/', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    const errors = []

    //replace white spaces, new lines and tabs with empty string
    username = username.replace(/\s\s+/g, ' ');
    password = password.replace(/\s\s+/g, ' ');

    if(username.length > 0 && password.length > 0) {
        db.signIn(username, function(error, user) {
            if(typeof user === "undefined") {
                errors.push("Wrong Username and/or Password!")
                res.render("signIn.hbs", {errors})
            } else if(error){
                errors.push("Error signing in, please try again later!")
                res.render("signIn.hbs", {errors})
            } else {
                bcrypt.compare(password, user.password, function(err, result){
                    if(result == true) {
                        req.session.isLoggedIn = true
                        req.session.userId = user.id
                        req.session.username = user.username
                        
                        res.render("home.hbs", {isLoggedIn: req.session.isLoggedIn})
                    } else {
                        errors.push("Error signing in, please try again later!")
                        res.render("signIn.hbs", {errors})
                    }
                })
            }
        })
    } else {
        errors.push("Wrong Username and/or Password!")
        res.render("signIn.hbs", {errors})
    }
})

module.exports = router