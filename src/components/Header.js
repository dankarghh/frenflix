import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import {
  onSnapshot,
  collection,
  query,
  where,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../firebase-config";

function Header() {
  const { user, logOut, loggedInUser } = useContext(AuthContext);

  const [userReviews, setUserReviews] = useState([]);
  const [notifications, setNotifications] = useState();

  let navigate = useNavigate();

  function handleLogOut() {
    logOut();
    navigate("/signin");
  }

  useEffect(() => {
    if (loggedInUser?.id === undefined) {
      return;
    }
    const q = query(
      collection(db, "reviews"),
      where("author", "==", loggedInUser?.id)
    );

    const unsubscribe = onSnapshot(q, querySnapshot => {
      setUserReviews(
        querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsubscribe;
  }, [loggedInUser]);

  // function getNotifications() {
  //   let array = [];
  //   userReviews.forEach(review => {
  //     review.notifications?.forEach(notification => {
  //       array.push(notification);
  //     });
  //     return array;
  //   });
  //   setNotifications(array);
  // }

  function getNotifications() {
    let x = "";
    userReviews.forEach(review => {
      review.notifications?.length > 0
        ? (x = x + review.notifications?.length)
        : (x = x);
    });
    setNotifications(x);
  }

  useEffect(() => {
    getNotifications();
  }, [userReviews]);

  return (
    <div className="header">
      <Link to="/newsfeed">
        <h1 className="header__heading">FRENFLIX</h1>
      </Link>
      {/* {user && (
        <Link to="/profile">
          <span class="material-symbols-outlined">person</span>
          <p>Account</p>
        </Link>
      )} */}
      {user ? (
        <div className="btn-container">
          <Link to={`/profile/${loggedInUser?.username}`}>
            <p>Profile</p>
          </Link>
          <button>{notifications}</button>
          <button className="btn" onClick={handleLogOut}>
            Logout
          </button>
        </div>
      ) : (
        <div className="btn-container">
          <Link to="/newuser">
            <button className="btn">Sign Up</button>
          </Link>
          <Link to="/signin">
            <button className="btn">Log In</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
