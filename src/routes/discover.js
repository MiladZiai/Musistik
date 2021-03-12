const express = require('express')
const router = express.Router()
const db = require('../../db')

router.get('/:page', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn
    const playlistsPerPage = 9
    let currentPage = req.params.page
    const offset = currentPage * playlistsPerPage
    let previousPage = nextPage = currentPage
    let lastPage = false
    let firstPage = false 
    const errors = []

    nextPage++
    if(previousPage > 0)
        previousPage--
    
    db.getAllPublicPlaylists(offset, function(error, playlists) {
        if(error) {
            errors.push("Could not load playlists, please try agian later!")
            res.render("discover.hbs", {errors})
        } else {
            if(playlists.length > 0) {
                db.getLengthOfPublicPlaylists(function(error, lengthOfPlaylists){
                    if(error) {
                        errors.push("Could not load playlists, please try agian later!")
                        res.render("discover.hbs", {errors})
                    } else {
                        if(currentPage == 0) {
                            firstPage = true
                        }
                        if(playlists.length < playlistsPerPage) {
                            lastPage = true
                        }
                        if(firstPage && lengthOfPlaylists[0]['count(*)'] <= playlistsPerPage){
                            lastPage = true
                        }
                        if(!firstPage && offset == (lengthOfPlaylists[0]['count(*)']-playlistsPerPage)){
                            firstPage = false
                            lastPage = true
                        }
                        const model = {
                            publicPlaylists: playlists,
                            isLoggedIn: isLoggedIn,
                            previousPage: previousPage,
                            nextPage: nextPage,
                            firstPage: firstPage,
                            lastPage: lastPage
                        }
                        res.render("discover.hbs", model)
                    }
                })
            } else {
                const model = {
                    publicPlaylists: playlists,
                    isLoggedIn: isLoggedIn,
                    firstPage: true,
                    lastPage: true
                }
                res.render("discover.hbs", model)
            } 
        }
    })
})

module.exports = router