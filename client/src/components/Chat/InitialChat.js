import "./Chat.css";

const InitialChat = () => {
  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__headerInfo">
          <h2>Welcome, select a channel to start conversation!</h2>
        </div>
      </div>
      <div className="chat__body"></div>
    </div>
  );
};

export default InitialChat;
