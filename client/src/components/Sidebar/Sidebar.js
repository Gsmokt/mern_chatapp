import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Avatar, IconButton } from "@material-ui/core";
import { AddCircleOutlineOutlined } from "@material-ui/icons";
import "./Sidebar.css";
import SidebarChat from "../SidebarChat/SidebarChat";
import { useStateValue } from "../../context/StateProvider";
import { apiNewChannel } from "../../components/axios";
import { auth } from "../../firebase-config";
import { signOut } from "firebase/auth";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import { actionTypes } from "../../context/reducer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Sidebar = () => {
  const [{ user }, dispatch] = useStateValue();
  const [newChat, setNewChat] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const addChannel = async () => {
    if (newChat) {
      try {
        await apiNewChannel({
          channelName: newChat,
          creator: user.uid,
        });
        setNewChat("");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const signout = async () => {
    await signOut(auth);
    localStorage.clear();
    dispatch({ type: actionTypes.REMOVE_USER });
    navigate("/");
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addChannel();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
    // eslint-disable-next-line
  }, [newChat]);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton onClick={handleClickOpen}>
            <ExitToAppOutlinedIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <input
            maxLength={25}
            value={newChat}
            onChange={(e) => setNewChat(e.target.value)}
            type="text"
            placeholder="Start new chat"
          />
          <AddCircleOutlineOutlined onClick={addChannel} />
        </div>
      </div>
      <h2>Channels list</h2>
      <div className="sidebar__chats">
        <SidebarChat />
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "gray" }}>
            Disagree
          </Button>
          <Button onClick={signout} sx={{ color: "gray" }}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
