import React, { useEffect, useState } from "react";
import {
  Delete,
  AttachFile,
  MoreVert,
  SearchOutlined,
  InsertEmoticon,
  Mic,
  Edit,
} from "@material-ui/icons";
import "./Chat.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  apiDeleteChannel,
  apiDeleteMessage,
  apiMessages,
  apiNewMessage,
  apiUpdateMessage,
} from "../axios";
import { useStateValue } from "../../context/StateProvider";
import Pusher from "pusher-js";
import Picker from "emoji-picker-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  DialogTitle,
  Slide,
  Avatar,
  IconButton,
} from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const pusher = new Pusher("8aa68e24e4442b8d7f8a", {
  cluster: "eu",
});

const Chat = () => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [openUpdateEmoji, setOpenUpdateEmoji] = useState(false);
  const { roomId } = useParams();
  const [seed, setSeed] = useState("");
  const [open, setOpen] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [input, setInput] = useState("");
  const [updateInput, setUpdateInput] = useState("");
  const [updateInputId, setUpdateInputId] = useState(null);
  const [{ user }] = useStateValue();
  const [messages, setMessages] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [userUid, setUserUid] = useState(null);
  const navigate = useNavigate();

  const onEmojiClick = (event, emojiObject) => {
    if (openEmoji) {
      setInput((prevState) => {
        return (prevState += emojiObject.emoji);
      });
      setOpenEmoji(false);
    } else {
      setUpdateInput((prevState) => {
        return (prevState += emojiObject.emoji);
      });
      setOpenUpdateEmoji(false);
    }
  };

  const sendMessage = async () => {
    if (input) {
      try {
        await apiNewMessage(roomId, {
          message: input,
          name: user.displayName,
          timestamp: new Date().toLocaleString(),
          received: true,
        });
        setInput("");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const getConversation = async () => {
    try {
      const { data } = await apiMessages(roomId);
      setRoomDetails(data.channelName);
      setUserUid(data.creator);
      setMessages(data.conversation);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deleteChannel = async () => {
    try {
      await apiDeleteChannel(roomId);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const updateMessage = async () => {
    if (updateInput) {
      try {
        await apiUpdateMessage(roomId, {
          id: updateInputId,
          message: updateInput,
          timestamp: new Date().toLocaleString(),
        });
      } catch (error) {
        toast.error(error.response.data.message);
      }
      setOpenUpdateDialog(false);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await apiDeleteMessage(roomId, {
        id,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenUpdateDialog = (message) => {
    setUpdateInput(message.message);
    setUpdateInputId(message._id);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!openUpdateDialog) {
          sendMessage();
        }
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
    // eslint-disable-next-line
  }, [input]);

  useEffect(() => {
    getConversation();
    setSeed(Math.floor(Math.random() * 5000));

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (data) {
      getConversation();
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
    // eslint-disable-next-line
  }, [roomId]);

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/b${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomDetails}</h3>
          <p>Last seen {messages[messages.length - 1]?.timestamp}</p>
        </div>
        <div className="chat__headerRight">
          {userUid === user.uid && (
            <IconButton onClick={handleClickOpen}>
              <Delete />
            </IconButton>
          )}
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message, id) => (
          <div key={id}>
            <span className="chat__name">
              {`${message.name} - ${message.timestamp}`}
            </span>
            <p
              key={id}
              className={`chat__message ${
                message.name !== user.displayName && "chat__receiver"
              }`}
            >
              {message.message}
              {userUid === user.uid && (
                <>
                  <Edit
                    className="chat__edit"
                    onClick={() => handleOpenUpdateDialog(message)}
                  />
                  <Delete
                    className="chat__edit"
                    onClick={() => deleteMessage(message._id)}
                  />
                </>
              )}
            </p>
          </div>
        ))}
      </div>
      <div className="chat__footer">
        {!openEmoji ? (
          <InsertEmoticon
            className="emoticon"
            onClick={() => setOpenEmoji(true)}
          />
        ) : (
          <Picker onEmojiClick={onEmojiClick} />
        )}
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <Mic />
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
            Are you sure you want to delete this channel?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "gray" }}>
            Disagree
          </Button>
          <Button onClick={deleteChannel} sx={{ color: "gray" }}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        aria-labelledby="form-dialog-title"
        className="chat__update"
      >
        <DialogTitle id="form-dialog-title">Update message</DialogTitle>
        <DialogContent className="chat__dialog">
          {!openUpdateEmoji ? (
            <InsertEmoticon
              className="emoticon"
              onClick={() => setOpenUpdateEmoji(true)}
            />
          ) : (
            <Picker onEmojiClick={onEmojiClick} />
          )}
          <TextField
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            value={updateInput}
            onChange={(e) => setUpdateInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} sx={{ color: "gray" }}>
            Cancel
          </Button>
          <Button onClick={updateMessage} sx={{ color: "gray" }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default Chat;
