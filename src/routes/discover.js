const express = require('express')
const router = express.Router()
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')

router.get('/', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn
    const errors = []
    db.getAllPublicPlaylists(function(error, playlists) {
        if(error) {
            errors.push("Could not load playlists, please try agian later!")
            res.render("discover.hbs", {errors: errors})
        } else {
            playlists = playlists.filter((playlist) => {
                playlist.songs = []
                const duplicates = playlists.filter(innerPlaylist => innerPlaylist.id === playlist.id).length
                const currentIndex = playlists.findIndex((foundPlaylist) => foundPlaylist && foundPlaylist.id === playlist.id)

                for(let i = currentIndex; i < currentIndex + duplicates; i++) {
                    playlist.songs.push({
                        songId: playlists[i].songId, 
                        songTitle: playlists[i].songTitle, 
                        artistName: playlists[i].artistName,
                        genre: playlists[i].genre, 
                        releaseDate: playlists[i].releaseDate
                    })
                    
                    if(i === currentIndex) {
                        delete playlist.songId;
                        delete playlist.songTitle;
                        delete playlist.artistName;
                        delete playlist.genre;
                        delete playlist.releaseDate;
                    }
                }
                playlists.splice(currentIndex, duplicates-1)

                return playlist
            })
            const model = {
                publicPlaylists: playlists,
                isLoggedIn: req.session.isLoggedIn
            }
            res.render("discover.hbs", model)
        }
    })
})




module.exports = router
