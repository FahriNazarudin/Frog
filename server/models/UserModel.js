const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class UserModel {
  static collection() {
    return database.collection("users");
  }

  static async getUsers() {
    return await this.collection().find({}).toArray();
  }

  static async register(newUser) {
    return await this.collection().insertOne(newUser);
  }
}

module.exports = { UserModel };
