import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Stack,
  Paper,
} from "@mui/material";
import { useBlogActions, useNotificationActions } from "../store";
import useField from "../hooks/useField";

const NewBlog = () => {
  const newAuthor = useField("text");
  const newTitle = useField("text");
  const newUrl = useField("text");

  const { addBlog } = useBlogActions();
  const { setMessage } = useNotificationActions();

  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    addBlog({
      author: newAuthor.value,
      title: newTitle.value,
      url: newUrl.value,
    });
    setMessage({
      text: `${newTitle.value} by ${newAuthor.value} added.`,
      type: "success",
    });
    navigate("/");
    newAuthor.reset();
    newTitle.reset();
    newUrl.reset();
  };

  const onReset = (event) => {
    event.preventDefault();
    newAuthor.reset();
    newTitle.reset();
    newUrl.reset();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack>
        <form onSubmit={onSubmit} onReset={onReset}>
          <h2>Add New Blog</h2>
          <Stack spacing={2}>
            <div>
              <TextField
                sx={{ width: "50%" }}
                label="Author"
                type={newAuthor.type}
                name="author"
                size="small"
                onChange={newAuthor.onChange}
                value={newAuthor.value}
              />
            </div>
            <div>
              <TextField
                sx={{ width: "50%" }}
                label="Blog title"
                type={newTitle.type}
                size="small"
                onChange={newTitle.onChange}
                value={newTitle.value}
              />
            </div>
            <div>
              <TextField
                sx={{ width: "50%" }}
                label="URL"
                type={newUrl.type}
                size="small"
                onChange={newUrl.onChange}
                value={newUrl.value}
              />
            </div>
            <div>
              <Button type="submit">Add Blog</Button>
              <Button type="reset">Clear</Button>
            </div>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};

export default NewBlog;
