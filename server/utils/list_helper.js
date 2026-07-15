const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return 0;
  }
  return blogs.reduce((sum, item) => sum + item.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }
  let mostLikes = 0;
  let bestBlog = null;

  blogs.forEach((blog) => {
    if (blog.likes > mostLikes) {
      bestBlog = blog;
      mostLikes = blog.likes;
    }
  });
  return bestBlog;
};

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }
  const authorCount = _.countBy(blogs, (blog) => blog.author);
  const mostAuthor = Object.keys(authorCount).reduce((a, b) =>
    authorCount[a] > authorCount[b] ? a : b,
  );
  return {
    author: mostAuthor,
    blogs: authorCount[mostAuthor],
  };
};

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }
  let likeCounts = {};
  blogs.forEach((blog) => {
    if (!likeCounts[blog.author]) {
      likeCounts[blog.author] = 0;
    }
    likeCounts[blog.author] += blog.likes;
  });
  const mostAuthor = Object.keys(likeCounts).reduce((a, b) =>
    likeCounts[a] > likeCounts[b] ? a : b,
  );
  return {
    author: mostAuthor,
    likes: likeCounts[mostAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
