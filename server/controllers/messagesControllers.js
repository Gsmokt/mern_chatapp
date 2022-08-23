import whatsappSchema from "../models/messages.js";

export const newMessage = async (req, res) => {
  const { id } = req.params;
  const dbMessage = req.body;
  try {
    const message = await whatsappSchema.findByIdAndUpdate(
      id,

      {
        $push: { conversation: dbMessage },
      },
      {
        new: true,
      }
    );
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const newChannel = async (req, res) => {
  const dbData = req.body;
  try {
    const data = await whatsappSchema.create(dbData);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getChannelList = async (req, res) => {
  try {
    const data = await whatsappSchema.find({});
    const channels = [];
    data.map((item) => {
      const channelInfo = {
        id: item._id,
        name: item.channelName,
      };
      channels.push(channelInfo);
    });
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getConversation = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await whatsappSchema.findById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Somenthing went wrong" });
  }
};

export const deleteChannel = async (req, res) => {
  const id = req.params.id;
  try {
    await whatsappSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Channel removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not remove channel, try later." });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const a = await whatsappSchema.updateOne(
      { _id: req.params.id, "conversation._id": req.body.id },
      { $set: { "conversation.$.message": req.body.message } }
    );
    res.status(200).json({ message: "Message updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not update message, try later." });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await whatsappSchema.updateOne(
      { _id: req.params.id },
      {
        $pull: { conversation: { _id: req.body.id } },
      }
    );
    res.status(201).json({ message: "Message removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
