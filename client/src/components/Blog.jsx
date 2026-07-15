import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useBlogActions } from "../store";
import useField from "../hooks/useField";
import {
  Box,
  Typography,
  Stack,
  Link,
  Button,
  Divider,
  Paper,
  TextField,
  List,
  ListItem,
} from "@mui/material";
const Blog = ({ blog }) => {
  const [likes, setLikes] = useState(blog ? blog.likes : 0);
  const [comments, setComments] = useState(blog ? blog.comments : []);
  const newComment = useField("text");
  const navigate = useNavigate();
  const user = useUser();
  const { updateLike, deleteBlog, addComment } = useBlogActions();

  //console.log("Blog: ", blog);
  useEffect(() => {
    if (!blog) {
      navigate("/");
    }
  }, [blog, navigate]);

  const handleBlogLike = () => {
    blog.likes += 1;
    setLikes(blog.likes);
    updateLike({ id: blog.id, likes: blog.likes });
  };

  const handleBlogDelete = async () => {
    console.log("delete handler for ", blog);
    if (window.confirm(`Really delete ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog);
      navigate("/");
    }
  };

  const handleComment = async () => {
    console.log("handleComment called");
    addComment({ id: blog.id, comment: newComment.value });
    setComments(comments.concat(newComment.value));
    newComment.reset();
  };

  if (blog) {
    return (
      <Paper sx={{ p: 2 }}>
        <Box className="blog">
          <Typography variant="h4" className="blog_title">
            {blog.title}
          </Typography>
          <Typography variant="subtitle1" className="blog_author">
            {blog.author}
          </Typography>
          <Divider />
          <Stack spacing={1} sx={{ marginTop: 3 }}>
            <Link className="blog_url" href={blog.url}>
              {blog.url}
            </Link>
            <div className="blog_likes">Likes: {likes}</div>
            <div className="blog_user">
              <em>
                Added by {blog.user ? blog.user.name : "missing information"}
              </em>
            </div>
            <Stack direction="row">
              {user && (
                <Button
                  variant="outlined"
                  name="like"
                  color="secondary"
                  onClick={handleBlogLike}
                >
                  like
                </Button>
              )}
              {user && blog.user && user.username === blog.user.username && (
                <Button
                  name="delete"
                  variant="outlined"
                  color="error"
                  onClick={handleBlogDelete}
                >
                  DELETE
                </Button>
              )}
            </Stack>
            <div className="blog_comments">
              <Typography variant="h5">Comments</Typography>
              {user && (
                <Stack direction="row">
                  <TextField
                    label="New comment"
                    type={newComment.type}
                    size="small"
                    onChange={newComment.onChange}
                    value={newComment.value}
                  />
                  <Button name="comment" onClick={handleComment}>
                    Add comment
                  </Button>
                </Stack>
              )}
              <List>
                {comments &&
                  comments.length > 0 &&
                  comments.map((comment, idx) => {
                    return (
                      <ListItem key={idx} variant="body2">
                        {comment}
                      </ListItem>
                    );
                  })}
                {(!comments || comments.length < 1) && (
                  <ListItem variant="body1">No comments yet.</ListItem>
                )}
              </List>
            </div>
          </Stack>
        </Box>
      </Paper>
    );
  }
};
export default Blog;
