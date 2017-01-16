var express = require('express');
var session = require('express-session');
var router = express.Router();
var dbConnector = require('../Helper/DatabaseConnector');
var db = dbConnector.connection;
var sess;


router.get('/', function(req, res, next) {
	res.render('connexion', {connected : true});
});


router.post('/', function(req, res, next) {

	sess = req.session;
	db.any("select * from clients where Login=$1", req.body.login)
    	.then(function (data) {
    		//Si le nom d'utilisateur n'existe pas
    		if (isEmptyObject(data)) {							
				console.log("Nom d'utilisateur inexistant");
				res.render('connexion', {connected : false});
			} else {
				if (req.body.password != data[0].password) {
					console.log("Password erroné");
					res.render('connexion', {connected : false});
				} else {
					console.log("Connecté : " + req.body.login);
					sess.login = req.body.login;
					sess.data = data[0];
					res.redirect('/compte/' + sess.login);
				}
			}
    	})
	    .catch(function (error) {
	    	console.log("ERROR:", error.message || error);
	        res.render('connexion', {connected : false});
	    });
});

function isEmptyObject(obj) {

	return !Object.keys(obj).length;
}

module.exports = router;
