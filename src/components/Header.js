import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import {
  onSnapshot,
  collection,
  query,
  doc,
  where,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import NewsfeedReview from "./NewsfeedReview";

function Header() {
  const { user, logOut, loggedInUser } = useContext(AuthContext);

  const [userReviews, setUserReviews] = useState([]);
  const [notifications, setNotifications] = useState();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState();

  let navigate = useNavigate();

  function handleLogOut() {
    logOut();
    navigate("/signin");
  }

  async function handleNotificationClick(id, notificationId) {
    const filteredNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    console.log(filteredNotifications);
    const reviewRef = doc(db, "reviews", id);
    try {
      await updateDoc(reviewRef, {
        notifications: filteredNotifications,
      });
    } catch (error) {
      console.log(error);
    }

    navigate({
      pathname: "/newsfeed",
      search: `?id=${id}`,
    });
    toggleNotificationMenu();
  }

  function toggleNotificationMenu() {
    document
      .querySelector(".header__notification-drop-down")
      .classList.toggle("hidden");
    setShowNotifications(prevState => !prevState);
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

  // const calculateUnreadNotifications = () => {
  //   let x = 0;
  //   notifications.forEach(notification => {
  //     if (notification.read === false) {
  //       x = x + 1;
  //     }
  //   });
  //   return x;
  // };

  function getNotifications() {
    let newArray = [];
    userReviews.forEach(review => {
      if (review.notifications) {
        for (let x = 0; x < review.notifications.length; x++) {
          newArray.push(review.notifications[x]);
        }
      }
    });
    setNotifications(newArray);
  }

  useEffect(() => {
    getNotifications();
    // calculateUnreadNotifications();
  }, [userReviews]);

  const notificationDropDown = notifications?.map(notification => {
    return (
      <div
        className="header__notification-drop-down-message"
        onClick={e =>
          handleNotificationClick(notification.reviewId, notification.id)
        }
      >
        {notification.message}
      </div>
    );
  });

  return (
    <div className="header">
      <Link to="/newsfeed">
        <h1 className="header__heading">FRENFLIX</h1>
      </Link>

      {user?.email ? (
        <div className="btn-container">
          <Link to={`/profile/${loggedInUser?.username}`}>
            <p>Profile</p>
          </Link>
          <span
            onClick={toggleNotificationMenu}
            className="material-symbols-outlined header__notification-container"
          >
            notifications
            {notifications.length > 0 && (
              <span className="header__notification-number">
                {notifications?.length}
              </span>
            )}
          </span>
          <button className="btn" onClick={handleLogOut}>
            Logout
          </button>
          <div className="header__notification-drop-down hidden">
            {notificationDropDown}
          </div>
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
