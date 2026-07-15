import axios from "axios";
const baseUrl = import.meta.env.PROD
  ? "/api/blogs"
  : "http://localhost:3003/api/blogs";

let userToken = null;

const setToken = (newToken) => {
  if (newToken === null) {
    userToken = null;
  } else {
    userToken = `Bearer ${newToken}`;
  }
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newBlogObject) => {
  const config = {
    headers: { Authorization: userToken },
  };
  const response = await axios.post(baseUrl, newBlogObject, config);
  return response.data;
};

const update = async (blogObject) => {
  const config = {
    headers: { Authorization: userToken },
  };
  const id = blogObject.id;
  if (!id) {
    console.error("blogs service: update called with no id set in blog object");
    return;
  }
  // NB: My own backend has a PATCH endpoint (see ../part4/bloglist/controllers/blogs.js)
  // that updates the data sent without touching any of the other data. There is actually
  // no PUT endpoint implemented, since "replace one blog list entry with a completely
  // new data document" felt like an unnecessary feature compared to "updating some of
  // the data of a blog list entry".
  // (Let's not talk about the fact that the implementation where the frontend tells
  // the backend what number to set the 'likes' to is rather prone to problems when two
  // users are using the system at the same time. Maybe that will come up in a later
  // exercise... Also I should have used /** */ instead of //.)

  const response = await axios.patch(`${baseUrl}/${id}`, blogObject, config);
  return response.data;
};

const deleteBlog = async (blogObject) => {
  const config = {
    headers: { Authorization: userToken },
  };
  const id = blogObject.id;
  if (!id) {
    console.error(
      "blogs service: deleteBlog called wit no id set in blog object",
    );
    return;
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response;
};

const addComment = async ({ id, comment }) => {
  const config = {
    headers: { Authorization: userToken },
  };
  if (!id) {
    console.error(
      "blogs service: addComment called with no id set in arguments",
    );
    return;
  }
  if (!comment) {
    console.error(
      "blogs service: addComment called with no comment set in arguments",
    );
    return;
  }
  const commentObject = {
    content: comment.toString(),
  };
  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    commentObject,
    config,
  );
  return response.data;
};

export default { getAll, create, setToken, update, deleteBlog, addComment };
