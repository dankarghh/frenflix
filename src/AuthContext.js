import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "./firebase-config";
import { setDoc, doc, collection, getDocs } from "firebase/firestore";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  function createAccount(email, password, username) {
    createUserWithEmailAndPassword(auth, email, password);
    setDoc(doc(db, "users", email), {
      profile: { username: username, about: "", criticRating: "8" },
    });
  }

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser);
  });

  return (
    <AuthContext.Provider
      value={{ createAccount, logOut, logIn, user, setUser, auth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
