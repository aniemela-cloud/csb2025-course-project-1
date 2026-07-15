const getUser = () => {
  const storedUserJSON = window.localStorage.getItem("currentBlogUser");
  if (storedUserJSON) {
    return JSON.parse(storedUserJSON);
  } else {
    return null;
  }
};
const saveUser = (user) => {
  window.localStorage.setItem("currentBlogUser", JSON.stringify(user));
};
const removeUser = () => {
  window.localStorage.removeItem("currentBlogUser");
};

export default { getUser, saveUser, removeUser };
