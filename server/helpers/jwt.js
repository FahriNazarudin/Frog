const { sign } = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


const signToken = (payload) => {
    return sign(payload, JWT_SECRET)
}

module.exports = {
    signToken, 
};