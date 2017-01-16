var express = require('express');
var session = require('express-session');
var router = express.Router();

var sess;

router.get('/:log', function(req, res, next) {
	sess = req.session;
	if ( sess.login == undefined ) {
		res.redirect('/');
	} else {
		db.one("select * from clients where Login=$1", sess.login)
    	.then(function (data) {
	        res.render('profil', { sess: sess, data: data.Item });
    	})
	    .catch(function (error) {
	    	console.log("ERROR:", error.message || error);
	        res.redirect('/');
	    });
	}
});


module.exports = router;
