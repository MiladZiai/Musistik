const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.set('views', path.join("musistik", "views"));
app.engine('hbs', expressHandlebars({
  defaultLayout: 'main.hbs',
}))

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render("home.hbs")
})

app.listen(8080, () => {
  console.log("##### Web app listening on port 8080 #####")
})