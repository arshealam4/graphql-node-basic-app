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

    try {
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
    } catch (err) {
      throw new Error(err);
    }
  },

  users: async function ({}, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    try {
      const users = await User.find();
      return users;
    } catch (err) {
      throw new Error(err);
    }
  },

  user: async function ({ id }) {
    if (validator.isEmpty(id)) {
      throw new Error("Invalid Input Parameter");
    }
    try {
      const user = await User.findById(id);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  },
};
