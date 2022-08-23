import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4700",
});

export const apiChannels = () => instance.get("/channels/sync");

export const apiNewChannel = (body) => instance.post("/channels/new", body);

export const apiNewMessage = (id, body) =>
  instance.post(`/messages/new/${id}`, body);

export const apiMessages = (id) => instance.get(`/messages/sync/${id}`);

export const apiDeleteChannel = (id) => instance.delete(`/channels/${id}`);

export const apiUpdateMessage = (id, body) =>
  instance.patch(`/messages/${id}`, body);

export const apiDeleteMessage = (id, body) =>
  instance.patch(`/messages/${id}/delete`, body);

export default instance;
