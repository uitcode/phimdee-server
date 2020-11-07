const https = require('https');
const fs = require('fs');
const app = require('./app');


//import dotenv
let dotenv = require('dotenv');
dotenv.config("./config.env");

//setup server port
var port = process.env.PORT || 8000;

// launch app to listen to specified port
app.listen(port, () => {
    console.log('Running on port ' + port);
});

// const options = {
//   key: fs.readFileSync('private.key'),
//   cert: fs.readFileSync('certificate.crt')
// };

// https.createServer(options, app, function (req, res) {
//   res.writeHead(200);
//   res.end("hello world 443\n");
// }).listen(443);