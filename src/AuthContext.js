import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "./firebase-config";
import { setDoc, doc, collection, onSnapshot } from "firebase/firestore";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  // const userCollectionRef = collection(db, "users");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [notificationClicked, setNotificationClicked] = useState(false);

  async function createAccount(email, password, username) {
    await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", email), {
      username: username,
      about: "",
      criticRating: "8",
    });
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser);
    if (currentUser) {
      findLoggedInUser(currentUser.email);
    }
  });

  function findLoggedInUser(email) {
    const activeUser = allUsers.find(user => user.id === email);
    setLoggedInUser(activeUser);
  }

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), snapshot => {
      setAllReviews(
        snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          // eslint-disable-next-line array-callback-return
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
  }, [user]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), snapshot => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAllUsers(data);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (user) {
      findLoggedInUser(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        notificationClicked,
        setNotificationClicked,
        findLoggedInUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
