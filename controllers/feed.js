const { validationResult } = require("express-validator/check");
const Post = require("../models/post.js");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "first post",
        content: "this is a test post",
        imageUrl: "./images/nina.JPG",
        creator: {
          name: "Max"
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array()
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.body.imageUrl;
  //console.log(title, content);
  const post = new Post({
    title: title,
    content: content,
    creator: {
      name: "Max"
    },
    imageUrl: imageUrl
  });

  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Post created",
        post: result
      });
    })
    .catch(err => console.log(err));
};
