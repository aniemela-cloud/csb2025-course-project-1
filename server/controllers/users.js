const userRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");
const bcrypt = require("bcrypt");

userRouter.post("/", async (request, response) => {
  if (!request || !request.body) {
    // the request object is ... unlikely to not exist,
    // but the request.body can be non-existent if no JSON
    // of any kind was given as part of the HTTP request
    return response.status(400).json({
      error: "request body missing",
    });
  }
  const { username, name, password } = request.body;
  if (!username) {
    return response.status(400).json({
      error: "username missing",
    });
  }
  if (!name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!password) {
    return response.status(400).json({
      error: "password missing",
    });
  }
  if (username.length < 3) {
    return response.status(400).json({
      error: "username too short: username must be at least 3 characters long",
    });
  }
  if (password.length < 3) {
    return response.status(400).json({
      error: "password too short: password must be at least 3 characters long",
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    username,
    name,
    passwordHash,
  });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});
userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    author: 1,
    title: 1,
    url: 1,
    likes: 1,
    _id: 1,
  });
  /*    for (let i = 0; i < users.length; i++) {
        let user = users[i]
        const blogs = await Blog.find({ user: user._id })
        console.log('user id', user._id, 'blogs', blogs)
        user.blogs = blogs
    }
    console.log('after loop, users array is:',users) */
  response.json(users);
});
userRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id).populate("blogs", {
    author: 1,
    title: 1,
    url: 1,
    likes: 1,
    _id: 1,
  });
  if (!user) {
    return response.status(404).end();
  } else {
    return response.json(user);
  }
});
module.exports = userRouter;
