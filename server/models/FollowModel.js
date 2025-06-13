const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class FollowModel {
  static collection() {
    return database.collection("follows");
  }

  static async followUser(followerId, followingId) {
    if (!followerId) {
      throw new Error("Follower ID is required");
    }
    if (!followingId) {
      throw new Error("Following ID is required");
    }
    if (followerId.toString() === followingId.toString()) {
      throw new Error("Cannot follow yourself");
    }


    const existingFollow = await this.collection().findOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });

    if (existingFollow) {
      throw new Error("Already following this user");
    }

    const newFollow = {
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.collection().insertOne(newFollow);
  }

  static async unfollowUser(followerId, followingId) {
    if (!followerId) {
      throw new Error("Follower ID is required");
    }
    if (!followingId) {
      throw new Error("Following ID is required");
    }

    return await this.collection().deleteOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });
  }

  static async getFollowers(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return await this.collection()
      .aggregate([
        {
          $match: { followingId: new ObjectId(userId) },
        },
        {
          $lookup: {
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "followerUser",
          },
        },
        {
          $unwind: "$followerUser",
        },
        {
          $project: {
            _id: "$followerUser._id",
            name: "$followerUser.name",
            username: "$followerUser.username",
            email: "$followerUser.email",
            createdAt: "$createdAt",
            isFollowing: { $literal: true },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray();
  }

  static async getFollowing(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return await this.collection()
      .aggregate([
        {
          $match: { followerId: new ObjectId(userId) },
        },
        {
          $lookup: {
            from: "users",
            localField: "followingId",
            foreignField: "_id",
            as: "followingUser",
          },
        },
        {
          $unwind: "$followingUser",
        },
        {
          $project: {
            _id: "$followingUser._id",
            name: "$followingUser.name",
            username: "$followingUser.username",
            email: "$followingUser.email",
            createdAt: "$createdAt",
            isFollowing: { $literal: true },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray();
  }

  static async isFollowing(followerId, followingId) {
    if (!followerId || !followingId) {
      return false;
    }

    const follow = await this.collection().findOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });
    return !!follow;
  }

  static async getAllUsers(currentUserId) {

    const allUsers = await database
      .collection("users")
      .find({ _id: { $ne: new ObjectId(currentUserId) } })
      .project({ password: 0 })
      .toArray();


    const usersWithFollowStatus = await Promise.all(
      allUsers.map(async (user) => {
        const isFollowing = await this.isFollowing(currentUserId, user._id);
        return {
          ...user,
          isFollowing,
        };
      })
    );

    return usersWithFollowStatus;
  }
}

module.exports = { FollowModel };
