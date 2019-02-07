const express = require('express')
const app = express()
const hbs = require('hbs');
require('./hbs/helpers.js')
const port = process.env.PORT || 5000;
var nombre = 'Julio';

app.use(express.static(__dirname + '/public'))

//Express HBS engine
hbs.registerPartials(__dirname + '/views/parciales');
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('home.hbs', {
    nombre: 'Julio'
  })
})

app.get('/about', (req, res) => {
  res.render('about.hbs')
})


app.listen(port, () => {
  console.log("Api Mi Triste Historia is up");
})