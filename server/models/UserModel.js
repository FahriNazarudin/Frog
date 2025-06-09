const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

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
    return await this.collection().findOne({ _id: new ObjectId(id) });
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
    if (!newUser.username) {
      throw new Error("Username is required");
    }
    if (!newUser.email) {
      throw new Error("Email is required");
    }
    if (!newUser.password) {
      throw new Error("Password is required");
    }

    return await this.collection().insertOne(newUser);
  }

  static async login(email, password) {
    const user = await this.collection().findOne({ email, password });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    return user;
  }
}

module.exports = { UserModel };
