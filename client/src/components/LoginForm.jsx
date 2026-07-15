import loginService from "../services/login";
import blogService from "../services/blogs";
import persistService from "../services/persistentUser";

import { useNavigate } from "react-router-dom";

import {
  TextField,
  Button,
  FormControl,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import { useNotificationActions, useUserActions } from "../store";
import useField from "../hooks/useField";

const LoginForm = () => {
  const username = useField("text");
  const password = useField("password");

  const { setMessage } = useNotificationActions();
  const { setUser } = useUserActions();

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userInfo = await loginService.login({
        username: username.value,
        password: password.value,
      });
      setUser(userInfo);
      blogService.setToken(userInfo.token);
      persistService.saveUser(userInfo);
      setMessage({ text: `${userInfo.name} logged in.`, type: "success" });
      navigate("/");
    } catch (error) {
      setMessage({ text: `Login failed: ${error.message}`, type: "error" });
    }
    username.reset();
    password.reset();
  };

  const handleReset = (event) => {
    event.preventDefault();
    username.reset();
    password.reset();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <form onSubmit={handleLogin} onReset={handleReset}>
        <Typography variant="h2">Login to BlogList</Typography>
        <Stack sx={{ width: "50%" }}>
          <FormControl>
            <TextField
              label="Username"
              name="username"
              autoComplete="username"
              onChange={username.onChange}
              value={username.value}
              type={username.type}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Password"
              name="password"
              autoComplete="current-password"
              type={password.type}
              value={password.value}
              onChange={password.onChange}
            />
          </FormControl>
        </Stack>
        <div>
          <Button type="submit" variant="contained">
            login
          </Button>
          <Button type="reset" variant="contained">
            clear
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default LoginForm;
