import { useEffect } from "react";
import { Routes, Route, Link, useMatch } from "react-router-dom";

import { Container, Button, AppBar, Toolbar, Typography } from "@mui/material";

import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import NewBlog from "./components/NewBlog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import UserList from "./components/UserList";
import UserDetails from "./components/UserDetails";
import blogService from "./services/blogs";
import persistService from "./services/persistentUser";

import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import {
  useBlogActions,
  useNotificationActions,
  useUser,
  useUserActions,
} from "./store";

const App = () => {
  const { setMessage } = useNotificationActions();
  const { initialize, getBlog } = useBlogActions();
  const { setUser } = useUserActions();
  const user = useUser();

  const match = useMatch("/blogs/:id");
  const blog = match ? getBlog(match.params.id) : null;
  //  const userMatch = useMatch("/users/:id");

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const storedUser = persistService.getUser();
    console.log("storedUser effect called");
    if (storedUser && storedUser.token) {
      setUser(storedUser);
      blogService.setToken(storedUser.token);
    }
  }, [setUser]);

  const handleLogout = (event) => {
    event.preventDefault();
    setUser(null);
    blogService.setToken(null);
    persistService.removeUser();
  };
  /* 
  const handleLike = async ({ id, likes }) => {
    console.log("updating likes for", id, "to", likes);
    updateLike({ id, likes });
  };
 */
  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} sx={style} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} sx={style} to="/users">
            User list
          </Button>
          {!user && (
            <Button color="inherit" component={Link} sx={style} to="/login">
              Login
            </Button>
          )}
          {user && (
            <Button color="inherit" component={Link} sx={style} to="/newblog">
              New Blog
            </Button>
          )}
          {user && (
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={style}
              name="logout"
            >
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div>
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div role="alert">
              <p>Error encountered in Notification:</p>
              <pre>{getErrorMessage(error)}</pre>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
          onReset={() => {
            setMessage(null);
          }}
        >
          <Notification />
        </ErrorBoundary>
      </div>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div role="alert">
            <p>Error encountered in Routes:</p>
            <pre>{getErrorMessage(error)}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
          </div>
        )}
      >
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route index element={<BlogList />} />
          <Route path="/blogs/:id" element={<Blog blog={blog} />} />
          <Route path="/newblog" element={<NewBlog />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route
            path="/*"
            element={
              <div>
                <h1>404 &mdash; Page not found.</h1>
                <p>
                  The page was not found on the server. Maybe there was
                  something wrong with the link?
                </p>
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
