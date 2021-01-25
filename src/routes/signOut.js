const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    req.session.isLoggedIn = false
    req.session.loggedInAccount = null
    res.render("signIn.hbs")
})

module.exports = router