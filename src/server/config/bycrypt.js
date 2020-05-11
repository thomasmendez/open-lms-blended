let bycrypt = require('bcrypt');

const rounds = 10

exports.generateHash = function(password) {
	return bycrypt.hashSync(password, bycrypt.genSaltSync(rounds), null);
}