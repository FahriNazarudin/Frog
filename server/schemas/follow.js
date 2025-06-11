const { FollowModel } = require("../models/FollowModel");

const followTypeDefs = `#graphql
    type Follow {
        _id: ID
        followerId: ID
        followingId: ID
        createdAt: String
        updatedAt: String
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
        getMyFollowers: [FollowUser]
        getMyFollowing: [FollowUser]
        isFollowing(userId: ID!): Boolean
        getAllUsers: [FollowUser]
    }

    type Mutation {
        followUser(userId: ID!): String
        unfollowUser(userId: ID!): String
    }
`;

const followResolvers = {
  Query: {
    getMyFollowers: async (_, __, { auth }) => {
      const user = await auth();
      return await FollowModel.getFollowers(user._id);
    },

    getMyFollowing: async (_, __, { auth }) => {
      const user = await auth();
      return await FollowModel.getFollowing(user._id);
    },

    isFollowing: async (_, { userId }, { auth }) => {
      const user = await auth();
      return await FollowModel.isFollowing(user._id, userId);
    },

    getAllUsers: async (_, __, { auth }) => {
      const user = await auth();
      return await FollowModel.getAllUsers(user._id);
    },
  },

  Mutation: {
    followUser: async (_, { userId }, { auth }) => {
      const user = await auth();

      if (user._id.toString() === userId) {
        throw new Error("Cannot follow yourself");
      }

      await FollowModel.followUser(user._id, userId);
      return "Successfully followed user";
    },

    unfollowUser: async (_, { userId }, { auth }) => {
      const user = await auth();

      const result = await FollowModel.unfollowUser(user._id, userId);
      if (result.deletedCount === 0) {
        throw new Error("You are not following this user");
      }

      return "Successfully unfollowed user";
    },
  },
};

module.exports = {
  followTypeDefs,
  followResolvers,
};
