var express = require('express');
var session = require('express-session');

var router = express.Router();
var dbConnector = require('../Helper/DatabaseConnector');
var db = dbConnector.connection;
var sess;

router.get('/', function(req, res, next) {
	res.render('inscription');
});

router.post('/', function(req, res, next) {

	sess = req.session;

	db.any("select * from clients where Login=$1", req.body.login)
    .then(function (data) {
    	//Si le nom d'utilisateur n'existe pas
        if (!isEmptyObject(data)) {							
			console.log("Utilisateur déjà existant");
			res.render('inscription', { pseudo: true});
		} else {
			var values = [req.body.lastname, req.body.firstname, req.body.birth, req.body.email, req.body.login, req.body.password];

			db.none("insert into clients(Lastname, Firstname, Birthdate, Email, Login, Password) values($1, $2, $3, $4, $5, $6)", values)
		    .then(function () {
		        sess.login = req.body.login;
				res.redirect('/connexion');
		    })
		    .catch(function (error) {
		        console.log("ERROR:", error.message || error);
				res.render('inscription', { field: true});
		    });
		}
    })
    .catch(function (error) {
    	console.log("ERROR during :", error.message || error);
        res.redirect('/');
    });

});


function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

module.exports = router;
