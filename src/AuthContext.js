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
  const [allUsers, setAllUsers] = useState([]);
  const userCollectionRef = collection(db, "users");
  const [loggedInUser, setLoggedInUser] = useState(null);

  function createAccount(email, password, username) {
    createUserWithEmailAndPassword(auth, email, password);
    setDoc(doc(db, "users", email), {
      username: username,
      about: "",
      criticRating: "8",
      reviews: "",
    });
  }

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    signOut(auth);
  }

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser);
  });

  useEffect(() => {
    async function getUsersAndLoggedInUser(user) {
      try {
        if (user.email) {
          const resp = await getDocs(userCollectionRef);
          const data = resp.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          const activeUser = data.find(doc => doc.id === user.email);
          setLoggedInUser(activeUser);

          setAllUsers(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUsersAndLoggedInUser(user);
  }, [user]);

  function findLoggedInUser(email) {
    const activeUser = allUsers.find(user => user.id === email);
    setLoggedInUser(activeUser);
    console.log(activeUser);
  }

  useEffect(() => {});

  return (
    <AuthContext.Provider
      value={{
        createAccount,
        logOut,
        logIn,
        user,
        setUser,
        auth,
        allUsers,
        loggedInUser,
        findLoggedInUser,
        setLoggedInUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
