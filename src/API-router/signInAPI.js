const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../../db')
const bcrypt = require('bcryptjs')
require('dotenv').config()

//login
router.post('/', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if(password.length > 0 && username.length > 0){
        db.signIn(username, function(error, user) {
            if(user)    {
                bcrypt.compare(password, user.password, (err, result) => {
                    if(result){
                        const token = jwt.sign({
                            username: user.username,
                            email: user.email,
                            id: user.id
                        },
                            process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        })
                        res.status(200).json({
                            message: "Auth successful",
                            token: token
                        })
                    }   else {
                        res.status(401).json({
                            message: 'Auth failed!'
                        })
                    }
                })
            } else {
                res.status(401).json({
                    message: 'Auth failed!'
                })
            }
        })
    } else {
        res.status(400).json({
            message: "Please enter username and password!"
        })
    }
})

module.exports = router