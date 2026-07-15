import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import userService from "../services/users";
import { Link } from "react-router-dom";
import { Box, List, ListItem, Paper, Typography } from "@mui/material";

const UserDetails = () => {
  const id = useParams().id;
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    console.log("useEffect of UserDetails", id);
    async function loadUser() {
      try {
        const loadedUser = await userService.get(id);
        console.log("async loadUser", loadedUser);
        if (loadedUser) {
          setUserInfo(loadedUser);
        } else {
          setUserInfo({
            name: "Error loading user",
            username: "Error loading user",
            blogs: [],
          });
        }
      } catch (error) {
        console.log("error loading user for details:", error);
        setUserInfo({
          name: "Error loading user",
          username: "Error loading user",
          blogs: [],
        });
      }
    }
    loadUser();
  }, [id]);

  if (!userInfo) {
    return (
      <Paper>
        <h3>Loading user...</h3>
        <div>Loading user...</div>
      </Paper>
    );
  } else {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h3">{userInfo.name}</Typography>
        <Box>
          <Typography variant="h6">Blogs added by user:</Typography>
          <List>
            {userInfo.blogs.map((blog) => {
              return (
                <ListItem key={blog.id}>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} by {blog.author}
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Paper>
    );
  }
};

export default UserDetails;
