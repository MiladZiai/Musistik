const express = require('express')
const router = express.Router()
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')

router.get('/', (req, res) => {
    errors = []
    if(req.query.search) {
        let searchedUser = req.query.search
        searchedUser = '%'+searchedUser+'%'
    
        db.getSearchedUser(searchedUser, function(error, users) {
            if(error) {
                errors.push("Could not load users, please try again later!")
                res.render("users.hbs", {errors})
            } else {
                users = users.filter((user) => {
                    user.playlists = []
                    const duplicates = users.filter(innerUser => innerUser.id === user.id).length
                    const currentIndex = users.findIndex((foundUser) => foundUser && foundUser.id === user.id)
    
                    for(let i = currentIndex; i < currentIndex + duplicates; i++) {
                        if(users[i].title && users[i].image && users[i].playlistId)
                            user.playlists.push({
                                title: users[i].title, 
                                image: users[i].image,
                                playlistId: users[i].playlistId
                            })
                        
                        if(i === currentIndex) {
                            delete user.title;
                            delete user.image;
                            delete user.playlistId;
                        }
                    }
                    users.splice(currentIndex, duplicates-1)
                    
                    return user
                })
                res.render("users.hbs", {users, isLoggedIn: req.session.isLoggedIn})
            }
        })
        
    } else {
        db.getAllUsers(function(error, users){
            if(error) {
                errors.push("Could not load users, please try again later!")
                res.render("users.hbs", {errors})
            } else {
                users = users.filter((user) => {
                    user.playlists = []
                    const duplicates = users.filter(innerUser => innerUser.id === user.id).length
                    const currentIndex = users.findIndex((foundUser) => foundUser && foundUser.id === user.id)
    
                    for(let i = currentIndex; i < currentIndex + duplicates; i++) {
                        if(users[i].title && users[i].image && users[i].playlistId)
                            user.playlists.push({
                                title: users[i].title, 
                                image: users[i].image,
                                playlistId: users[i].playlistId
                            })
                        
                        if(i === currentIndex) {
                            delete user.title;
                            delete user.image;
                            delete user.playlistId;
                        }
                    }
                    users.splice(currentIndex, duplicates-1)
                    
                    return user
                })
                res.render("users.hbs", {users, isLoggedIn: req.session.isLoggedIn})
            }
        })
    }
    
    
})

router.get('/detailviewSongs/:id', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn
    const playlistId = req.params.id
    errors = []
    db.getSongsInPlaylistById(playlistId, function(error, songs) {
        if(error) {
            errors.push("Error occured when loading songs, please try again later!")
            res.render("detailviewSongs.hbs", {errors: errors, isLoggedIn})
        } else {
            //playlist title fetched together with songs
            const title = songs[0].title
            res.render("detailviewSongs.hbs", {isLoggedIn, songs: songs, title})
        }
    })
})



module.exports = router