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
    let title = req.body.playlistTitle
    let private = req.body.private
    const userId = req.body.userId

    //replace white spaces, new lines and tabs with empty string
    title = title.replace(/\s\s+/g, ' ')

    if(req.file === undefined){
        res.status(400).json({
            message: "please select an image for the playlist!"
        })
    } else if(title.length > 25){
        res.status(400).json({
            message: "Title can not be more than 25 characters!"
        })
    } else if(!title || !private || title == ' '){
        res.status(400).json({
            message: "please select a title and/or private for the playlist!"
        })
    } else {
        const playlistImage = req.file.filename 
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
    let title = req.body.title
    let artist = req.body.artist
    let genre = req.body.genre
    const playlistId = req.params.id
    const inputSize = 20

    title = title.replace(/\s\s+/g, ' ')
    artist = artist.replace(/\s\s+/g, ' ')
    genre = genre.replace(/\s\s+/g, ' ')

    if(!title || !genre || !artist ||
        title == ' ' || genre == ' ' || artist == ' '){
        res.status(400).json({
            message: "Please enter title, genre and artist of the song!"
        })
    } else if(title.length > inputSize || genre.length > inputSize || artist.length > inputSize){
        res.status(400).json({
            message: "Inputs can not be more than 20 characters!"
        })
    } else {
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
                db.getSongId(function(error, song) {
                    if(error){
                        res.status(400).json({
                            message: "Database error, please try again later!"
                        })
                    } else {
                        db.addSongInPlaylist(playlistId, song.id, function(error) {
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
    }
})

module.exports = router