import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { apiChannels } from "../../components/axios";
import Pusher from "pusher-js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography, Box } from "@material-ui/core";

const pusher = new Pusher("8aa68e24e4442b8d7f8a", {
  cluster: "eu",
});

const SidebarChat = () => {
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();

  const getChannels = async () => {
    try {
      const { data } = await apiChannels();
      setChannels(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const selectChannel = (id) => {
    if (id) {
      navigate(`/room/${id}`);
    }
  };

  useEffect(() => {
    getChannels();
    const channel = pusher.subscribe("channels");
    channel.bind("newChannel", function (data) {
      getChannels();
    });
    channel.bind("deleteChannel", function (data) {
      getChannels();
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <>
      {channels.map((channel, index) => {
        return (
          <Box
            className="sidebarChat"
            onClick={() => selectChannel(channel.id)}
            key={index}
          >
            <Typography># {channel.name}</Typography>
          </Box>
        );
      })}
      <ToastContainer />
    </>
  );
};

export default SidebarChat;
