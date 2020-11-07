//import express
let express = require('express');
const cors = require('cors');

//import root router
let rootRouter = require('./src/router/index');

//import body parser
let bodyParser = require('body-parser');

//init the app
let app = express();

let whitelist = ['http://localhost:4200', 'https://web.postman.co', 'https://phimdee.com', 'https://localhost']
app.use(cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  exposedHeaders: ['Authorization'],
  credentials: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(express.static('src/public'))

app.use('/api/v1', rootRouter);

//send message for default url
app.get('/', (req, res) => res.send('Hello world with Express haha'));

module.exports = app;
