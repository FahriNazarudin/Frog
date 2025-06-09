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

  static async login(email, password) {
    const user = await this.collection().findOne({ email, password });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    return user;
  }
}

module.exports = { UserModel };
