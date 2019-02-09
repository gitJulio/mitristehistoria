const express = require('express')
const app = express()
const pg = require('../config/ps_conection')

var datetime = require('node-datetime');
var dt;
var formattedDate;
var misHistorias=new Array();

//**************************************************//
//**************************************************//
app.get('/', async (req, res) => {
  let view_historias = await pg.func('public.ft_view_historias').catch(err => {
    console.log(err);
  })


  for (var i = 0; i < view_historias.length; i++) {
    dt = datetime.create(view_historias[i]["fecha"]);
    formattedDate = dt.format('m/d/y H:M');
    view_historias[i]["fecha"]=formattedDate
  }


  res.render('home.hbs', {
    historias: view_historias
  })
})



app.get('/about', async (req, res) => {

  let view_historias = await pg.func('public.ft_view_historias').catch(err => {
    console.log(err);
  })
  // console.log(JSON.parse(view_historias));

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

module.exports = app;
