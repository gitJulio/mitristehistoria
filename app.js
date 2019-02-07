const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const hbs = require('hbs');
require('./config/config')
require('./hbs/helpers.js')
// const pg = require('pg')
const pg = require('./config/ps_conection')

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



app.get('/about', async (req, res) => {

  let view_historias = await pg.func('public.ft_view_historias').catch(err => {
    console.log(err);
  })
  console.log(view_historias);
  console.log("view_historias");
  // res.render('about.hbs')
  // res.send(view_historias)
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