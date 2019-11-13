const jwt = require('jsonwebtoken');

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
	const token = req.headers.authorization;

	if (token) {
		//check validity
		const secret = process.env.JWT_SECRET || "let's keep it secret and keep it safe!";
		jwt.verify(token, secret, (err, decodedToken) => {
			if (err) {
				//bad token
				res.status(401).json({ message: 'Invalid credentials' });
			} else {
				req.decodedJwt = decodedToken;
				next();
			}
		});
	} else {
		res.status(400).json({ message: 'No token or credentials provided' });
	}
};
