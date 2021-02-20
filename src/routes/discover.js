const express = require('express')
const router = express.Router()
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')

router.get('/:page', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn
    const playlistsPerPage = 9
    let currentPage = req.params.page
    const offset = currentPage * playlistsPerPage
    let previousPage = nextPage = currentPage

    nextPage++
    if(previousPage > 0)
        previousPage--
    
    const errors = []
    db.getAllPublicPlaylists(offset, function(error, playlists) {
        if(error) {
            errors.push("Could not load playlists, please try agian later!")
            res.render("discover.hbs", {errors: errors})
        } else {
            if(playlists.length > 0) {
                console.log('playlists.length : ', playlists.length )
                
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
                    isLoggedIn: isLoggedIn,
                    previousPage: previousPage,
                    nextPage: nextPage
                }
                res.render("discover.hbs", model)
            } else {
                currentPage--
                res.redirect("/discover/" + currentPage)
            } 
        }
    })
})




module.exports = router
