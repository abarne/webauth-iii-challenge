const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, checkDepartment('sales'), (req, res) => {
	Users.find()
		.then((users) => {
			res.json(users);
		})
		.catch((err) => res.send(err));
});

module.exports = router;

function checkDepartment(department) {
	return function(req, res, next) {
		console.log('department', req.decodedJwt);
		if (department === req.decodedJwt.department) {
			next();
		} else {
			res.status(403).json({ messgage: 'You do not have access to this' });
		}
	};
}
