const {UserModel} = require('../models/UserModel');
const userTypeDefs = `#graphql
    type User {
        _id: ID,
        name: String,
        username: String,
        email: String,
        password: String,
    }
  
    type Query {
      getUsers: [User],
    }

    type Mutation {
      register(name :String, username: String, email : String, password: String) : User
    }

  `;

const userResolvers = {
  Query: {
    getUsers: async () => {
        return await UserModel.getUsers();
    },
},

  Mutation: {
    register: async (_, { name, username, email, password }) => {
      const newUser = {
        name,
        username,
        email,
        password,
      }
      await UserModel.register(newUser);
      return newUser;
    },
  },
};
module.exports = {
  userTypeDefs,
  userResolvers,
};
