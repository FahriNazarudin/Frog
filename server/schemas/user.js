const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
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

    type LoginResponse {
      accessToken: String
    }

    type Mutation {
      register(name : String, username: String, email : String, password: String) : String
      login(username: String, password: String): LoginResponse
    }   
  `;

const userResolvers = {
  Query: {
    getUsers: async (_, args, { auth }) => {
      await auth();
      return await UserModel.getUsers();
    },
    getUserById: async (_, { id }, { auth }) => {
      await auth();
      const foundUser = await UserModel.getUserById(id);
      return foundUser;
    },

    getUserByUsername: async (_, { username }, { auth }) => {
      await auth();
      const foundUser = await UserModel.getUserByUsername(username);
      return foundUser;
    },
  },

  Mutation: {
    register: async (_, { name, username, email, password }) => {
      const newUser = { name, username, email, password };
      await UserModel.register(newUser);
      return "User registered successfully";
    },

    login: async (_, { username, password }) => {
      const user = await UserModel.login(username, password);
      const accessToken = signToken({
        id: user._id,
        username: user.username,
      });
      return { accessToken };
    },
  },
};
module.exports = {
  userTypeDefs,
  userResolvers,
};
