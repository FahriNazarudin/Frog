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
    if (followerId === followingId) {
      throw new Error("Cannot follow yourself");
    }

    // Check if already following
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
            as: "follower",
          },
        },
        {
          $unwind: "$follower",
        },
        {
          $project: {
            _id: "$follower._id",
            name: "$follower.name",
            username: "$follower.username",
            email: "$follower.email",
            createdAt: "$createdAt",
          },
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
            as: "following",
          },
        },
        {
          $unwind: "$following",
        },
        {
          $project: {
            _id: "$following._id",
            name: "$following.name",
            username: "$following.username",
            email: "$following.email",
            createdAt: "$createdAt",
          },
        },
      ])
      .toArray();
  }

  static async isFollowing(followerId, followingId) {
    const follow = await this.collection().findOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });
    return !!follow;
  }
}

module.exports = { FollowModel };
