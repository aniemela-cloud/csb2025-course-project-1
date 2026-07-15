import { Alert } from "@mui/material";
import { useNotification } from "../store";


const Notification = () => {
  const message = useNotification()
  if (message === null || message === undefined) {
    return null;
  }
  return <Alert severity={message.type}>{message.text}</Alert>;
};

export default Notification;
