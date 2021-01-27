const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'views/public/uploads')
    },
    filename:function(req,file, callback)   {
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
        db.getAllPlaylistsByUsername(userId, function(error, playlist) {
            if(error) {
                errors.push("Error occured when loading playlists, please try again later")
                res.render("library.hbs", {errors: errors})
            } else {

                privatePlaylists = playlist.filter(playlist => playlist.private == 1)
                publicPlaylists = playlist.filter(playlist => playlist.private == 0)

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



module.exports = router