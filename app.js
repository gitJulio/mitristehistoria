const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const hbs = require('hbs');
require('./config/config')
require('./hbs/helpers.js')
// const port = process.env.PORT || 5000;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(express.static(__dirname + '/public'))

//Express HBS engine -
hbs.registerPartials(__dirname + '/views/parciales');
app.set('view engine', 'hbs');

//**************************************************//
//**************************************************//
app.get('/', (req, res) => {
  res.render('home.hbs', {
    nombre: 'Julio'
  })
})

app.get('/about', (req, res) => {
  res.render('about.hbs')
})

app.post('/mensajes', function(req, res) {
  console.log(req.body.id)
  res.json('get Mensaje');
})

//************************************************//
//************************************************//

app.listen(process.env.PORT, () => {
  console.log("Api Mi Triste Historia is up");
})