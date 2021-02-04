const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'views/public/uploads')
    },
    filename: (req, file, callback) =>  {
        callback(null, req.session.userId + "-" + file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
})
const upload = multer( {storage: storage} )

router.get('/', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn
    const userId = req.session.userId
    const errors = []
    var privatePlaylists = []
    var publicPlaylists = []

    if(isLoggedIn) {
        db.getAllPlaylistsById(userId, function(error, playlists) {
            if(error) {
                errors.push("Error occured when loading playlists, please try again later")
                res.render("library.hbs", {errors: errors})
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
                
                privatePlaylists = playlists.filter(playlist => playlist.private == 1)
                publicPlaylists = playlists.filter(playlist => playlist.private == 0)

                const model = {
                    privatePlaylists: privatePlaylists,
                    publicPlaylists: publicPlaylists,
                    isLoggedIn: isLoggedIn
                }

                res.render("library.hbs", model)
            }
        })
    } else  
        res.render("library.hbs", {isLoggedIn: req.session.isLoggedIn})
})

router.get('/createPlaylist', (req, res) => {
    if(!req.session.isLoggedIn)
        res.redirect('/signIn')
    else
        res.render("createPlaylist.hbs", {isLoggedIn: req.session.isLoggedIn})
})
router.post('/createPlaylist', upload.single('playlistImage'), (req, res) => {
    const isLoggedIn = req.session.isLoggedIn
    errors = []
    if(isLoggedIn) {
        const title = req.body.playlistTitle
        let private = req.body.private
        const playlistImage = req.file.filename 
        const userId = req.session.userId

        if(!title){
            errors.push("please select a title for the playlist!")
            res.render("createPlaylist.hbs", {errors})
        }

        if(typeof playlistImage === undefined){
            errors.push("please select an image for the playlist!")
            res.render("createPlaylist.hbs", {errors})
        }
        
        if(typeof private === "undefined")
            private = 0
        else
            private = 1

        const model = {
            userId: userId,
            title: title,
            private: private,
            playlistImage: playlistImage,
            playListOwner: userId,
        }
        
        db.createPlaylist(model, function(error) {
            if(error) {
                errors.push("Error occured when creating playlist, please try again later!")
                res.render("createPlaylist.hbs", {errors: errors})
            } else {
                res.redirect("/library")
            }
        })
    } else {
        errors.push("Please sign in!")
        res.render("createPlaylist.hbs", {errors: errors})
    }
})

router.get('/addSong', (req, res) => {
    const playlistId = req.query.id
    if(!req.session.isLoggedIn)
        res.redirect('/signIn')
    else{
        res.render("addSong.hbs", {isLoggedIn: req.session.isLoggedIn, playlistId: playlistId})
    }
        
})
router.post('/addSong', (req, res) => {

    const isLoggedIn = req.session.isLoggedIn
    errors = []
    if(isLoggedIn) {
        const title = req.body.title
        const artist = req.body.artist
        const genre = req.body.genre
        const playlistId = req.body.playlistId
        
        const model = {
            title: title,
            artist: artist,
            genre: genre
        }
        db.addSong(model, function(error) {
            if(error) {
                errors.push("Error occured when creating song, please try again later!")
                res.render("addSong.hbs", {errors: errors})
            } else {
                db.getSongId(function(error, songId){
                    if(error){
                        errors.push("Database error, please try again later!")
                        res.render("addSong.hbs", {errors: errors})
                    } else {
                        db.addSongInPlaylist(playlistId, songId.id , function(error){
                            if(error) {
                                errors.push("Error occured when adding song to playlist!")
                                res.render("addSong.hbs", {errors: errors})
                            }
                        })
                    }
                })
                res.redirect("/library")
            }
        })
    } else {
        errors.push("Please sign in!")
        res.render("addSong.hbs", {errors: errors})
    }
})

router.post('/deleteSongInPlaylist', (req, res) => {
    const songId = req.body.songId
    const errors = []
    db.deleteSongInPlaylist(songId, function(error){
        if(error){
            errors.push("Error occured when deleting song!")
            res.render("library.hbs", {errors: errors})
        } else {
            db.deleteSongFromSongsInPlaylist(songId, function(error){
                if(error){
                    errors.push("Error occured when deleting song!")
                    res.render("library.hbs", {errors: errors})
                } else {
                    res.redirect("/library")
                }
            })
        }
    })
})


module.exports = router