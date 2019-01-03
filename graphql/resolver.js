const User = require("../models/user");
const Post = require("../models/post");
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
  },
  createPost: ({ postInput }, req) => {
    if (!req.isAuth) {
      const error = new Error("Not authenticated");
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid" });
    }

    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid Input");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl
    });

    return User.findById(req.userId)
      .then(user => {
        post.creator = user;
        user.post.push(post);
        return user.save();
      })
      .then(user => {
        return post.save();
      })
      .catch(err => {
        throw err;
      });

    // const post = new Post({
    //   title: postInput.title,
    //   content: postInput.content,
    //   imageUrl: postInput.imageUrl
    // });
    // return post
    //   .save()
    //   .then(res => {
    //     return {
    //       ...res._doc,
    //       _id: res.id,
    //       createdAt: res.createdAt.toISOString(),
    //       updatedAt: res.updatedAt.toISOString()
    //     };
    //   })
    //   .catch(err => {
    //     throw err;
    //   });
  }
};
