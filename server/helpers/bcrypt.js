const { hashSync, compareSync } = require('bcryptjs');

const hashPassword = (password) => {
    const saltRounds = 10;
    return hashSync(password, saltRounds);
}


module.exports = { hashPassword }