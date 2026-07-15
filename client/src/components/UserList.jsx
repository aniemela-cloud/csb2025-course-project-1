import { Link } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import userService from "../services/users";
import { useState } from "react";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    //console.log("in useEffect of UserList");
    async function loadUsers() {
      const loadedUsers = await userService.getAll();
      //console.log("async loadUsers()", loadedUsers);
      if (loadedUsers) {
        setUsers(loadedUsers);
      }
    }
    loadUsers();
  }, [setUsers]);
  if (!users || users.length < 1) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h2">Users</Typography>
        <Typography>No registered users loaded...</Typography>
      </Paper>
    );
  }
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h2">Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link to={`${user.id}`}>{user.name}</Link>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
export default UserList;
