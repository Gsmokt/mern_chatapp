import express from "express";
import mongoose from "mongoose";
import connectDB from "./db/connect.js";
import cors from "cors";
import dotenv from "dotenv";
import Pusher from "pusher";
import xss from "xss-clean";
import helmet from "helmet";
import messagesRoute from "./routes/messagesRoute.js";
import channelRoute from "./routes/channelRoute.js";
dotenv.config();

const app = express();
app.use(helmet());
app.use(xss());
const port = process.env.PORT || 4700;

const pusher = new Pusher({
  appId: "1463198",
  key: "8aa68e24e4442b8d7f8a",
  secret: "75b49958fba3de2b27c5",
  cluster: "eu",
  useTLS: true,
});

app.use(express.json());
app.use(cors());
app.use("/messages", messagesRoute);
app.use("/channels", channelRoute);

connectDB(process.env.MONGO_URL).then(() => {
  const changeStream = mongoose.connection
    .collection("whatsappmessages")
    .watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      pusher.trigger("channels", "newChannel", {
        change: change,
      });
    } else if (change.operationType === "update") {
      pusher.trigger("messages", "inserted", {
        change: change,
      });
    } else if (change.operationType === "delete") {
      pusher.trigger("channels", "deleteChannel", {
        change: change,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
