import { Link } from "react-router-dom";
import Blog from "./Blog";
import { useBlogs } from "../store";
import {
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  Paper,
  TextField,
  List,
  ListItem,
} from "@mui/material";
const BlogList = () => {
  const blogs = useBlogs();
  if (blogs === undefined) {
    return null;
  }
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h2">blogs</Typography>
      <List>
        {blogs.map((blog) => {
          //console.log('blogList map: user:',user,'blog',blog)
          //const deleteBlog = (user && user.username === blog.user.username ? handleBlogDelete : undefined)
          //return (<Blog key={blog.id} blog={blog} updateLike={updateLike} deleteBlog={deleteBlog}/>)
          return (
            <ListItem key={blog.id}>
              <Link to={`blogs/${blog.id}`}>
                {blog.title} by {blog.author}
              </Link>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
export default BlogList;
