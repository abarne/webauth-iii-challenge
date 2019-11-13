const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
	let user = req.body;
	const hash = bcrypt.hashSync(user.password, 10);
	user.password = hash;

	Users.add(user)
		.then((saved) => {
			res.status(201).json(saved);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'Error registering user' });
		});
});

router.post('/login', (req, res) => {
	let { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then((user) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				//produce a token
				const token = getJwtToken(user);
				//send token to client
				res.status(200).json({
					message: `Welcome ${user.username}!, have a token...`,
					token
				});
			} else {
				res.status(401).json({ message: 'Invalid Credentials' });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: 'Error logging in' });
		});
});

function getJwtToken(user) {
	const payload = {
		username: user.username,
		department: user.department
	};
	console.log('payload', payload);
	const secret = process.env.JWT_SECRET || "let's keep it secret and keep it safe!";
	const options = {
		expiresIn: '1d'
	};
	return jwt.sign(payload, secret, options);
}

module.exports = router;
