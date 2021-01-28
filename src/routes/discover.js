const express = require('express')
const router = express.Router()
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')
router.get('/', (req, res) => {
    errors = []
    db.getAllPublicPlaylists(function(error, publicPlaylists) {
        if(error) {
            errors.push("Could not load playlists, please try agian later!")
            res.render("discover.hbs", {errors: errors})
        } else {
            const model = {
                publicPlaylists: publicPlaylists,
                isLoggedIn: req.session.isLoggedIn
            }
            res.render("discover.hbs", model)
        }
    })
})




module.exports = router
