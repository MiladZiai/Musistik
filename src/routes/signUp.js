const express = require('express')
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')
const bcrypt = require('bcryptjs')
const router = express.Router()
const pwMinLength = 6
const csrf = require('csurf')
const csrfProtection = csrf({cookie: true})

router.get('/', (req, res) => {
    res.render("signUp.hbs")
})

router.post('/createUserAccount', (req, res) => {
    let username = req.body.name
    let email = req.body.email
    let password = req.body.password
    const repeatPassword = req.body.repeatPassword
    const errors = []

    //replace white spaces, new lines and tabs with empty string
    username = username.replace(/\s\s+/g, ' ');
    username = username.replace(" ", "")

    email = email.replace(/\s\s+/g, ' ');
    email = email.replace(" ", "")

    password = password.replace(/\s\s+/g, ' ');

    if(!username || username.length > 20)
        errors.push("Enter a username between 1 and 20 characters!")

    if(!email.includes("@"))
        errors.push("Email is not valid!")

    if(password.length < pwMinLength) 
        errors.push("Password too short, at least 6 characters!")

    if(password != repeatPassword)
        errors.push("Password doesn't match!")

    if(errors.length < 1) {
        bcrypt.genSalt(10, function(err, salt) {
            if(err){
                errors.push("Could not create account, please try again later!")
                res.render("signUp.hbs", {errors})
            } else {
                bcrypt.hash(password, salt, function(err, hash) {
                    if(err){    
                        errors.push("Could not create account, please try again later!")
                        res.render("signUp.hbs", {errors})
                    } else {
                        db.createUserAccount(username, email, hash, function(error) {
                            if(error) {
                                if(error.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: User.email")
                                    errors.push("This E-mail address is already registred!")
                                else if(error.message =="SQLITE_CONSTRAINT: UNIQUE constraint failed: User.username")
                                    errors.push("This username is not available!")
                                else
                                    errors.push("An internal server error occurred!")
                                
                                const model = {
                                    username: username,
                                    email: email,
                                    errors: errors
                                }
                                res.render("signUp.hbs", model)   
                            } else {
                                db.signIn(username, function(error, user) {
                                    if(typeof user === "undefined") {
                                        errors.push("Could not create account, please try again later!")
                                        res.render("signUp.hbs", {errors})
                                    } else if(error){
                                        errors.push("Could not create account, please try again later!")
                                        res.render("signUp.hbs", {errors})
                                    } else {
                                        bcrypt.compare(password, user.password, function(err, result){
                                            if(result == true) {
                                                req.session.isLoggedIn = true
                                                req.session.userId = user.id
                                                req.session.username = user.username
                                                
                                                res.render("home.hbs", {isLoggedIn: req.session.isLoggedIn})
                                            } else {
                                                errors.push("Could not create account, please try again later!")
                                                res.render("signUp.hbs", {errors})
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    } else {
        res.render("signUp.hbs", {errors})
    }
})


module.exports = router