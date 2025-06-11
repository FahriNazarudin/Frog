const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");


class UserModel {
  static collection() {
    return database.collection("users");
  }

  static async getUsers() {
    return await this.collection().find({}).toArray();
  }

  static async getUserById(id) {
    if (!id) {
      throw new Error("User ID is required");
    }
    const user = await this.collection().findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  static async getUserProfile(id) {
    if (!id) {
      throw new Error("User ID is required");
    }

    const agg = [
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: "follows",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$followingId", "$$userId"] },
              },
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
              $unwind: {
                path: "$followerUser",
                preserveNullAndEmptyArrays: true,
              },
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
          ],
          as: "followersData",
        },
      },
      {
        $lookup: {
          from: "follows",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$followerId", "$$userId"] },
              },
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
              $unwind: {
                path: "$followingUser",
                preserveNullAndEmptyArrays: true,
              },
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
          ],
          as: "followingData",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          username: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1,
          followers: "$followersData",
          following: "$followingData",
        },
      },
    ];

    const users = await this.collection().aggregate(agg).toArray();
    console.log("User Profile with Relations:", users);

    if (!users || users.length === 0) {
      throw new Error("User not found");
    }

    return users[0];
  }

  static async getUserByUsername(username = "") {
    const users = await this.collection()
      .find({
        username: {
          $regex: username,
          $options: "i",
        },
      })
      .toArray();
    return users;
  }

  static async register(newUser) {
    if (
      !newUser.name ||
      !newUser.username ||
      !newUser.email ||
      !newUser.password
    ) {
      throw new Error("Username, Name, Email, Password is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      throw new Error("Invalid email format");
    }
    if (newUser.password.length < 5) {
      throw new Error("Password must be at least 5 characters long");
    }

    const existingUser = await this.collection().findOne({
      $or: [{ username: newUser.username }, { email: newUser.email }],
    });
    if (existingUser) {
      throw new Error("Username or Email already exists");
    }

    newUser.password = hashPassword(newUser.password);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();

    await this.collection().insertOne(newUser);

    return "User registered successfully";
  }

  static async findOne(query) {
    return await this.collection().findOne(query);
  }

  static async login(username, password) {
    const user = await this.collection().findOne({ username });
    if (!user) {
      throw new Error("Invalid username/password");
    }
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid username/password");
    }

    return user;
  }
}



module.exports = { UserModel };
