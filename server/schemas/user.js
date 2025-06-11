const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { UserModel } = require("../models/UserModel");
const { FollowModel } = require("../models/FollowModel");

const userTypeDefs = `#graphql
    type User {
        _id: ID
        name: String
        username: String
        email: String
        followers: [FollowUser]
        following: [FollowUser]
    }
  
    type FollowUser {
        _id: ID
        name: String
        username: String
        email: String
        createdAt: String
        isFollowing: Boolean
    }

    type Query {
        getUsers: [User]
        getUserById(id: ID): User
        getUserByUsername(username: String): [User]
        getUserProfile(id: ID): User
    }

    type LoginResponse {
        accessToken: String
    }

    type Mutation {
        register(name: String, username: String, email: String, password: String): String
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

    getUserProfile: async (_, { id }, { auth }) => {
      const user = await auth();
      const foundUser = await UserModel.getUserProfile(user._id);
      return foundUser;
    },
  },

  User: {
    followers: async (parent, _, { auth }) => {
      await auth();

      if (parent.followers && Array.isArray(parent.followers)) {
        return parent.followers;
      }

      return await FollowModel.getFollowers(parent._id);
    },

    following: async (parent, _, { auth }) => {
      await auth();

      if (parent.following && Array.isArray(parent.following)) {
        return parent.following;
      }

      return await FollowModel.getFollowing(parent._id);
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
