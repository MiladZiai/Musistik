const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render("discover.hbs")
})


module.exports = router
