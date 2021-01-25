const express = require('express')
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')
const bcrypt = require('bcryptjs')
const router = express.Router()
const pwMinLength = 6

router.get('/', (req, res) => {
    res.render("signUp.hbs")
})

router.post('/createUserAccount', (req, res) => {
    const username = req.body.name
    const email = req.body.email
    const password = req.body.password
    const repeatPassword = req.body.repeatPassword
    const errors = []

    if(!email.includes("@"))
        errors.push("Email is not valid!")

    if(password.length < pwMinLength) 
        errors.push("Password too short, at least 6 characters!")

    if(password != repeatPassword)
        errors.push("Password doesn't match!")

    if(errors.length < 1) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                db.createUserAccount(username, email, hash, function(error) {
                    if(error) {
                        errors.push("Database error, please try again later!")
                        res.render("signUp.hbs", {errors: errors})
                    } else {
                        req.session.isLoggedIn = true
                        res.render("home.hbs", {isLoggedIn: req.session.isLoggedIn})
                    }
                })
            })
        })
    } else {
        res.render("signUp.hbs", {errors: errors})
    }
})


module.exports = router