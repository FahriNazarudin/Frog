const { UserModel } = require("../models/UserModel");
const userTypeDefs = `#graphql
    type User {
        _id: ID,
        name: String,
        username: String,
        email: String,
        password: String,
    }
  
    type Query {
      getUsers: [User]
      getUserById(id: ID): User
      getUserByUsername(username: String): [User]
      
    }

    type Mutation {
      register(name :String, username: String, email : String, password: String) : User
      login(email: String, password: String): User
    }   


  `;

const userResolvers = {
  Query: {
    getUsers: async () => {
      return await UserModel.getUsers();
    },
    getUserById: async (_, { id }) => {
      const foundUser = await UserModel.getUserById(id);
      return foundUser;
    },

    getUserByUsername: async (_, { username }) => {
      const foundUser = await UserModel.getUserByUsername(username);
      return foundUser;
    },
  },

  Mutation: {
    register: async (_, { name, username, email, password }) => {
      const newUser = {
        name,
        username,
        email,
        password,
      };
      await UserModel.register(newUser);
      return newUser;
    },

    login: async (_, { email, password }) => {
      await UserModel.login(email, password);
      return user;
    },
  },
};
module.exports = {
  userTypeDefs,
  userResolvers,
};
