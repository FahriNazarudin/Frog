const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const { hashPassword } = require("../helpers/bcrypt");

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
    if (!newUser.name || !newUser.username || !newUser.email || !newUser.password) {
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
      $or: [
        { username: newUser.username }, 
        { email: newUser.email }
      ],
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

  static async login(email, password) {
    const user = await this.collection().findOne({ email, password });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    return user;
  }
}

module.exports = { UserModel };
