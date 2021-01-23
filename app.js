const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')

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

app.get('/discover', (req, res) => {
  res.render("discover.hbs")
})

app.get('/users', (req, res) => {
  res.render("users.hbs")
})

app.get('/library', (req, res) => {
  res.render("library.hbs")
})

app.get('/about', (req, res) => {
  res.render("about.hbs")
})

app.get('/contact', (req, res) => {
  res.render("contact.hbs")
})

app.get('/signIn', (req, res) => {
  res.render("signIn.hbs")
})

app.get('/signUp', (req, res) => {
  res.render("signUp.hbs")
})

app.listen(8080, () => {
  console.log("##### Web app listening on port: 8080 #####")
})