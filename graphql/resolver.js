const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { secret } = require("../secretJWTKey");

module.exports = {
  hello() {
    return {
      text: "Hello World",
      views: 123
    };
  },
  createUser: async ({ userInput }, req) => {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Email not valid" });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const email = userInput.email;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const error = new Error("User exist already!");
      throw error;
    }

    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw
    });

    const createdUser = await user.save();

    return {
      ...createdUser._doc,
      _id: createdUser._id.toString()
    };
  },
  login: async ({ email, password }, req) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found");
      error.code = 404;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong Password");
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      secret,
      { expiresIn: "1h" }
    );
    return {
      token: token,
      userId: user.id
    };
  }
};
