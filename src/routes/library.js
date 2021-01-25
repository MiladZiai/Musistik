const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render("library.hbs", {isLoggedIn: req.session.isLoggedIn})
})


module.exports = router