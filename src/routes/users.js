const express = require('express')
const router = express.Router()
const db = require('/Users/miladziai/Documents/skolan/Musistik/db')

router.get('/', (req, res) => {
    errors = []
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
                    if(users[i].title && users[i].image)
                        user.playlists.push({
                            title: users[i].title, 
                            image: users[i].image
                        })
                    
                    if(i === currentIndex) {
                        delete user.title;
                        delete user.image;
                    }
                }
                users.splice(currentIndex, duplicates-1)

                return user
            })
            res.render("users.hbs", {users, isLoggedIn: req.session.isLoggedIn})
        }
    })
})




module.exports = router