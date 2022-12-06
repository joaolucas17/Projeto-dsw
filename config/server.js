console.log('[Config] Server');
const express = require('express'); // O express retorna uma função
const body_parser = require('body-parser')

let app = express(); //express é uma função. 
let port = process.env.PORT || 3000;

app.set('views', './app/views');
app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(body_parser.urlencoded({ extended:true }));

app.listen(port, function () {
	console.log('Servidor rodando com express na porta', port);
});
module.exports = app;