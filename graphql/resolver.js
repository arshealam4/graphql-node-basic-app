const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const config = require("../config/config.json");

const User = require("../database/models/user");

module.exports = {
  signup: async function ({ userInput }, req) {
    const email = userInput.email;
    const name = userInput.name;
    const password = userInput.password;

    if (
      !validator.isEmail(email) ||
      validator.isEmpty(name) ||
      validator.isEmpty(password)
    ) {
      throw new Error("Invalid Input Parameter");
    }
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error("User exists already!");
        throw error;
      }
      const hashedPw = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        name,
        password: hashedPw,
      });
      const createdUser = await user.save();
      return createdUser;
    } catch (err) {
      throw new Error(err);
    }
  },

  login: async function ({ email, password }) {
    if (!validator.isEmail(email) || validator.isEmpty(password)) {
      throw new Error("Invalid Input Parameter");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found.");
      error.code = 400;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect.");
      error.code = 400;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      config.secret,
      { expiresIn: config.tokenExpiry }
    );
    return { token: token, userId: user._id.toString() };
  },

  users: async function ({}, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const users = await User.find();
    return users;
  },
};
