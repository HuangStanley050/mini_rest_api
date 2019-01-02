const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
  hello() {
    return {
      text: "Hello World",
      views: 123
    };
  },
  createUser: async ({ userInput }, req) => {
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
  }
};
