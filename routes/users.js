var express = require('express');
var router = express.Router();
var usera = require('../app/controllers/userCtrl.js');
var app = express();
	app.post('/addUser',usera.registrationUser);
  app.post('/update',usera.functionupdate);
	app.post('/addprovider',usera.providerUser);
	app.get('/find',usera.find);
	app.get('/finduser',usera.finduserid);
	app.post('/email',usera.email);
	app.post('/otpsend',usera.sendotp);
	app.post('/upload',usera.uploadimage);
	app.post('/twilioVerify',usera.twilioVerify);
	app.post('/dynamicSChema',usera.dynamicSChema);




module.exports = app;
