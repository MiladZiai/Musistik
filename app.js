const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')

//routes
const discover = require("./src/routes/discover")
const library = require("./src/routes/library")
const signIn = require("./src/routes/signIn")
const signUp = require("./src/routes/signUp")
const users = require("./src/routes/users")

{
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set('views', path.join("", "views"));
app.engine('hbs', expressHandlebars({
  defaultLayout: 'main.hbs',
}))

app.use(express.static(path.join(__dirname, '/views/public')))

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render("home.hbs")
})

app.get('/about', (req, res) => {
  res.render("about.hbs")
})

app.get('/contact', (req, res) => {
  res.render("contact.hbs")
})

app.use("/discover", discover)
app.use("/library", library)
app.use("/signIn", signIn)
app.use("/signUp", signUp)
app.use("/users", users)

app.listen(8080, () => {
  console.log("##### Web app listening on port: 8080 #####")
})

return app
}