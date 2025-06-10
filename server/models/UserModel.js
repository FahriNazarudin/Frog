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
