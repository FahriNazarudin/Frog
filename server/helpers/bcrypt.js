const { hashSync, compareSync } = require('bcryptjs');

const hashPassword = (password) => {
    const saltRounds = 10;
    return hashSync(password, saltRounds);
}

const comparePassword = (password, hashedPassword) => {
    return compareSync(password, hashedPassword);
}


module.exports = { hashPassword, comparePassword };