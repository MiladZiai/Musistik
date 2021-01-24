const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render("users.hbs")
})


module.exports = router