const express = require('express')
const app = express()
const pg = require('../config/ps_conection')
var htmlencode = require('htmlencode');
var datetime = require('node-datetime');
var dt;
var formattedDate;
var misHistorias = new Array();
var decode = require('decode-html');


//**************************************************//
//**************************************************//
app.get('/', async (req, res) => {
  let view_historias = await pg.func('public.ft_view_historias').catch(err => {
    console.log(err);
  })

  for (var i = 0; i < view_historias.length; i++) {
    dt = datetime.create(view_historias[i]["fecha"]);
    formattedDate = dt.format('m/d/y H:M');
    view_historias[i]["fecha"] = formattedDate
  }

  res.render('home.hbs', {
    historias: view_historias
  })
})



//************************************************//
//************************************************//

module.exports = app;