const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render("discover.hbs", {isLoggedIn: req.session.isLoggedIn})
})




module.exports = router
