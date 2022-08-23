import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBknSYM8q_KHSY6l9wEUdAhLtOFcC155zw",
  authDomain: "slack-clone-14ddd.firebaseapp.com",
  projectId: "slack-clone-14ddd",
  storageBucket: "slack-clone-14ddd.appspot.com",
  messagingSenderId: "221898481102",
  appId: "1:221898481102:web:bb8b878b6106432ff9df9f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
