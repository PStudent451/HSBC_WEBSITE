var express = require('express');
var session = require('express-session');
var db = require('../Helper/DatabaseConnector')
var router = express.Router();

var sess;

router.get('/:log', function(req, res, next) {
	sess = req.session;
	if ( sess.login != req.params.log ) {
		res.redirect('/');
	} else {
		var birthdate = formatDate(sess.data.birthdate);
		res.render('compte', { sess: sess, data: sess.data, birthdate: birthdate });
	}
});

/*router.post('/:log', function(req, res, next) {

	sess = req.session;
	if ( sess.login != req.params.log ) {
		res.redirect('/');
	} else {

		var docClient = new AWS.DynamoDB.DocumentClient();
		var table = "Users";
		var pseudo = sess.login;

		var params = {
		    TableName: table,
		    Key: {
		        "Pseudo": pseudo
		    },
		    UpdateExpression:
		        "SET Gender = :gender, Firstname = :firstname, Lastname = :lastname, Birth = :birth, Email = :email, Phone = :phone",
		    ExpressionAttributeValues: {
		    	":gender": req.body.gender,
		        ":firstname": req.body.firstname,
		        ":lastname": req.body.lastname,
		        ":birth": req.body.birth,
		        ":email": req.body.email,
		        ":phone": req.body.phone
		    },
		    ReturnValues:"UPDATED_NEW"
		};

		console.log("Updating the item...");
		docClient.update(params, function(err, data) {
		    if (err) {
		        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
				res.render('/', { sess: sess });
		    } else {
		        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
		        var docClient = new AWS.DynamoDB.DocumentClient();
				var table = "Users";
				var pseudo = sess.login;

				var params = {
				    TableName: table,
				    Key:{
				        "Pseudo": pseudo
				    }
				};

				docClient.get(params, function(err, data) {				
					if (err) {
						console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
						res.redirect('/');
					} else {
						console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
						sess.type = data.Item.type;
						res.render('compte', { sess: sess, data: data, check: true});
					}
				});
		    }
		});

	}
});*/

function formatDate(date) {
	var birthdate = date.split('T')[0];
	var day = Number(birthdate.substring(8));
	var hour = Number(date.split('T')[1].split(':')[0]);
	birthdate = birthdate.substring(0,8);
	birthdate += (hour > 12) ? ++day : --day;
	return birthdate;
}

module.exports = router;
