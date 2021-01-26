const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')


//routes
const discover = require("./src/routes/discover")
const library = require("./src/routes/library")
const signIn = require("./src/routes/signIn")
const signUp = require("./src/routes/signUp")
const users = require("./src/routes/users")
const signOut = require("./src/routes/signOut")


const app = express()

var sessionOptions = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}

app.engine('hbs', expressHandlebars({
  defaultLayout: 'main.hbs',
}))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, '/views/public')))
app.use(session(sessionOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.get('/', (req, res) => {
  res.render("home.hbs", {isLoggedIn: req.session.isLoggedIn})
})
app.get('/about', (req, res) => {
  res.render("about.hbs", {isLoggedIn: req.session.isLoggedIn})
})
app.get('/contact', (req, res) => {
  res.render("contact.hbs", {isLoggedIn: req.session.isLoggedIn})
})


app.use("/discover", discover)
app.use("/library", library)
app.use("/signIn", signIn)
app.use("/signUp", signUp)
app.use("/users", users)
app.use("/signOut", signOut)

app.listen(8080, () => {
  console.log("##### Web app listening on port: 8080 #####")
})

return app
