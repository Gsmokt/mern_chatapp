import React from "react";
import { Button } from "@material-ui/core";
import "./Login.css";
import { auth, provider } from "../../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useStateValue } from "../../context/StateProvider";
import { actionTypes } from "../../context/reducer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  // eslint-disable-next-line
  const [{}, dispatch] = useStateValue();

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        dispatch({ type: actionTypes.SET_USER, user: res.user });
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/archive/6/6b/20200905003027%21WhatsApp.svg/119px-WhatsApp.svg.png"
          alt="WhatsApp"
        />
        <div className="login__text">
          <h1>Sign in to Messenger App</h1>
        </div>
        <Button onClick={signIn}>Sign In with Google</Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
