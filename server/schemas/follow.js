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
    }

    type Query {
        getFollowers(userId: ID): [FollowUser]
        getFollowing(userId: ID): [FollowUser]
        isFollowing(followerId: ID, followingId: ID): Boolean
    }

    type Mutation {
        followUser(followerId: ID, followingId: ID): String
        unfollowUser(followerId: ID, followingId: ID): String
    }
`;

const followResolvers = {
  Query: {
    getFollowers: async (_, { userId }) => {
      return await FollowModel.getFollowers(userId);
    },

    getFollowing: async (_, { userId }) => {
      return await FollowModel.getFollowing(userId);
    },

    isFollowing: async (_, { followerId, followingId }) => {
      return await FollowModel.isFollowing(followerId, followingId);
    },
  },

  Mutation: {
    followUser: async (_, { followerId, followingId }) => {
      await FollowModel.followUser(followerId, followingId);
      return "Successfully followed user";
    },

    unfollowUser: async (_, { followerId, followingId }) => {
      const result = await FollowModel.unfollowUser(followerId, followingId);
      if (result.deletedCount === 0) {
        throw new Error("Follow relationship not found");
      }
      return "Successfully unfollowed user";
    },
  },
};

module.exports = {
  followTypeDefs,
  followResolvers,
};
