import "./App.css";
import Chat from "./components/Chat/Chat";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./components/Login/Login";
import { useStateValue } from "./context/StateProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InitialChat from "./components/Chat/InitialChat";

function App() {
  const [{ user }] = useStateValue();

  return (
    <div className="app">
      <Router>
        {!user ? (
          <Login />
        ) : (
          <div className="app__body">
            <Sidebar />
            <Routes>
              <Route path="/" element={<InitialChat />} />
              <Route path="/room/:roomId" element={<Chat />} />
            </Routes>
          </div>
        )}
      </Router>
    </div>
  );
}

export default App;
