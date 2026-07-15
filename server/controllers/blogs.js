const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    _id: 1,
  });
  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  const blogpost = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
    _id: 1,
  });
  if (!blogpost) {
    return response.status(404).end();
  } else {
    return response.json(blogpost);
  }
});

blogRouter.post("/", userExtractor, async (request, response) => {
  const blogpost_data = request.body;
  const user = request.user;
  if (!user) {
    return response.status(401).json({
      error: "you must be logged in to post",
    });
  }
  if (!blogpost_data) {
    return response.status(400).json({
      error: "empty request body",
    });
  }
  if (typeof blogpost_data !== "object") {
    return response.status(400).json({
      error: "malformed request body",
    });
  }
  if (!blogpost_data.author) {
    return response.status(400).json({
      error: "author field missing",
    });
  }
  if (!blogpost_data.title) {
    return response.status(400).json({
      error: "title field missing",
    });
  }
  if (!blogpost_data.url) {
    return response.status(400).json({
      error: "url field missing",
    });
  }
  const blog = new Blog({
    author: blogpost_data.author,
    title: blogpost_data.title,
    url: blogpost_data.url,
    likes: blogpost_data.likes ? blogpost_data.likes : 0,
    user: user._id,
  });
  await blog.save();
  const result = await Blog.findOne({ _id: blog._id }).populate("user", {
    username: 1,
    name: 1,
    _id: 1,
  });
  if (!user.blogs) {
    user.blogs = [];
  }
  user.blogs = user.blogs.concat(blog._id);
  await user.save();
  return response.status(201).json(result);
  /*  blog.save().then((result) => {
      response.status(201).json(result)
    }) */
});

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({
      error: "you must be logged in to delete a post",
    });
  }
  const post = await Blog.findById(request.params.id);
  if (post) {
    if (post.user.toString() === user._id.toString()) {
      // we now need to remove this post from the user object's
      // "blogs" array
      const filtered = user.blogs.filter(
        (postId) => postId.toString() != post._id.toString(),
      );
      user.blogs = filtered;
      await user.save();
      await post.deleteOne();
      return response.status(204).end();
    } else {
      return response.status(401).json({
        error: "only the author may delete a post",
      });
    }
  } else {
    return response.status(404).json({
      error: "unknown post id",
    });
  }

  /*  if (result) {
    return response.status(204).end()
  } */
});

blogRouter.patch("/:id", async (request, response) => {
  let result = null;
  let new_data = {};
  if (request && request.body) {
    if (request.body.likes || request.body.likes === 0) {
      new_data.likes = request.body.likes;
    }
    if (request.body.author) {
      new_data.author = request.body.author;
    }
    if (request.body.title) {
      new_data.title = request.body.title;
    }
    if (request.body.url) {
      new_data.url = request.body.url;
    }
  }
  if (Object.keys(new_data).length > 0) {
    result = await Blog.findByIdAndUpdate(request.params.id, new_data, {
      returnDocument: "after",
    });
  }
  // this will also catch the case where no useful data was passed in the request
  if (!result) {
    return response.status(404).end();
  } else {
    return response.json(result);
  }
});

blogRouter.post("/:id/comments", userExtractor, async (request, response) => {
  const comment_data = request.body;
  const user = request.user;
  if (!user) {
    return response.status(401).json({
      error: "you must be logged in to post",
    });
  }
  if (!comment_data) {
    return response.status(400).json({
      error: "empty request body",
    });
  }
  if (typeof comment_data !== "object") {
    return response.status(400).json({
      error: "malformed request body",
    });
  }
  if (!comment_data.content) {
    return response.status(400).json({
      error: "content field missing",
    });
  }
  const blogpost = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
    _id: 1,
  });
  if (!blogpost) {
    return response.status(404).end();
  } else {
    blogpost.comments = blogpost.comments.concat(comment_data.content);
    await blogpost.save();
    return response.json(blogpost);
  }

  const blog = new Blog({
    author: blogpost_data.author,
    title: blogpost_data.title,
    url: blogpost_data.url,
    likes: blogpost_data.likes ? blogpost_data.likes : 0,
    user: user._id,
  });
  await blog.save();
  const result = await Blog.findOne({ _id: blog._id }).populate("user", {
    username: 1,
    name: 1,
    _id: 1,
  });
  if (!user.blogs) {
    user.blogs = [];
  }
  user.blogs = user.blogs.concat(blog._id);
  await user.save();
  return response.status(201).json(result);
  /*  blog.save().then((result) => {
      response.status(201).json(result)
    }) */
});

module.exports = blogRouter;
