import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "./firebase-config";
import {
  setDoc,
  doc,
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const userCollectionRef = collection(db, "users");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [allReviews, setAllReviews] = useState([]);

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
    const unsubscribe = onSnapshot(collection(db, "reviews"), snapshot => {
      setAllReviews(
        snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .sort(function sortPosts(a, b) {
            if (a.created < b.created) {
              return 1;
            }
            if (a.created > b.created) {
              return -1;
            }
          })
      );
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), snapshot => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAllUsers(data);
    });

    return unsubscribe();
  }, []);

  async function findLoggedInUser(email) {
    const activeUser = allUsers.find(user => user.id === email);
    setLoggedInUser(activeUser);
  }

  useEffect(() => {
    findLoggedInUser(user.email);
  }, [user]);

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
        setLoggedInUser,
        allReviews,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
