var express = require('express');
var session = require('express-session');
var dbConnector = require('../Helper/DatabaseConnector');
var db = dbConnector.connection;
var router = express.Router();

var sess;

router.get('/:log', function(req, res, next) {
	sess = req.session;
	if ( sess.login != req.params.log ) {
		res.redirect('/');
	} else {
		var birthdate = formatDate(sess.data.birthdate);
		res.render('compte', { sess: sess, data: sess.data, birthdate: birthdate});
	}
});

router.post('/:log', function(req, res, next) {

	sess = req.session;
	if ( sess.login != req.params.log ) {
		res.redirect('/connexion');
	} else {
		var values = [req.body.lastname, req.body.firstname, req.body.birth, req.body.email, sess.login];

		db.none("update clients set Lastname = $1, Firstname = $2, Birthdate = $3, Email = $4 where Login = $5", values)
	    .then(function () {
	    	updateSessionData(values);
			res.render('compte', { sess: sess, data: sess.data, birthdate: sess.data.birthdate, check: true});
	    })
	    .catch(function (error) {
	        console.error("Unable to update item. Error JSON:", error);
			res.render('/connexion', { sess: sess });
	    });
	}
});

function formatDate(date) {
	var birthdate = date.split('T')[0];
	var day = Number(birthdate.substring(8));
	var hour = Number(date.split('T')[1].split(':')[0]);
	birthdate = birthdate.substring(0,8);
	birthdate += (hour > 12) ? ++day : --day;
	return birthdate;
}

function updateSessionData(values) {
	sess.data.lastname = values[0];
	sess.data.firstname = values[1];
	sess.data.birthdate = values[2];
	sess.data.email = values[3];
}

module.exports = router;
