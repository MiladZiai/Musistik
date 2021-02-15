const express = require('express')
const router = express.Router()
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')
require('dotenv').config()
const checkAuth = require('../API-router/middleware/checkAuth')
const path = require('path')
const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'views/public/uploads')
    },
    filename: (req, file, callback) =>  {
        callback(null, req.body.userId + "-" + file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
})
const upload = multer( {storage: storage} )

router.post("/", checkAuth, upload.single('playlistImage'), (req, res) => {
    const title = req.body.playlistTitle
    let private = req.body.private
    const playlistImage = req.file.filename 
    const userId = req.body.userId

    if(!title || !private){
        res.status(400).json({
            message: "please select a title and/or private for the playlist!"
        })
    } else {
        const model = {
            title: title,
            private: private,
            playlistImage: playlistImage,
            playListOwner: userId,
        }
        db.createPlaylist(model, function(error){
            if(error){
                res.status(400).json({
                    message: "oops something went wrong, please try again later!"
                })
            } else {
                res.status(204).json()
            }
        })
    } 
})

router.post("/addSongToPlaylist/:id", checkAuth, (req, res) => {
    const title = req.body.title
    const artist = req.body.artist
    const genre = req.body.genre
    const playlistId = req.params.id

    const model = {
        title: title,
        artist: artist,
        genre: genre
    }
    db.addSong(model, function(error) {
        if(error){
            res.status(400).json({
                message: "Error occured when adding song, please try again later!"
            })
        } else {
            db.getSongId(function(error, songId) {
                if(error){
                    res.status(400).json({
                        message: "Database error, please try again later!"
                    })
                } else {
                    db.addSongInPlaylist(playlistId, songId.id, function(error) {
                        if(error){
                            res.status(400).json({
                                message: "Error occured when adding song to playlist!"
                            })
                        } else {
                            res.status(204).json()
                        }
                    })
                }
            })
        }
    })
})

module.exports = router