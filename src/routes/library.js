const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, originalname);
    }
})
const upload = multer( {storage: storage} )

router.get('/', (req, res) => {
    res.render("library.hbs", {isLoggedIn: req.session.isLoggedIn})
})


router.get('/createPlaylist', (req, res) => {
    res.render("createPlaylist.hbs", {isLoggedIn: req.session.isLoggedIn})
})
router.post('/createPlaylist', upload.single('playlistImage'), (req, res) => {
    return res.json({status: "OK"}) 
    /*if(req.session.isLoggedIn) {
        const title = req.body.title
        const private = req.body.private

    }*/
})


module.exports = router