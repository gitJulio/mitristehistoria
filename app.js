var express = require('express')
var app = express()

app.get('/', (req, res) => {
  let salida = {
    "respuesta": true
  }
  res.send(salida)
})

app.listen(5000, () => {
  console.log("Api Mi Triste Historia is up");
})