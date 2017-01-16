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
	db.one("select * from clients where Login=$1", req.body.login)
    	.then(function (data) {
	        res.render('profil', { sess: sess, data: data.Item });
    	})
	    .catch(function (error) {
	    	console.log("ERROR:", error.message || error);
	        res.render('connexion', {connected : false});
	    });

	/*docClient.get(params, function(err, data) {	
		if (err) {
			console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
			res.render('connexion', {connected : false});

		} else {
			console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
			if (isEmptyObject(data)) {							//Si le nom d'utilisateur n'existe pas
				console.log("Nom d'utilisateur inexistant");

				res.render('connexion', {connected : false});
			} else {											//Si le nom d'utilisateur n'existe pas
				if (req.body.password != data.Item.Password) {
					console.log("Password erroné");
					res.render('connexion', {connected : false});
				} else {
					console.log("Connecté : " + req.body.login);
					sess.login = req.body.login;
					sess.type = data.Item.Type;
					res.redirect('/profil');

				}
			}
		}
	});
*/
});

function isEmptyObject(obj) {

	return !Object.keys(obj).length;
}

module.exports = router;
