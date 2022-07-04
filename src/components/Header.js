import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import NewsfeedReview from "./NewsfeedReview";

function Header() {
  const { user, logOut, loggedInUser } = useContext(AuthContext);
  const [userReviews, setUserReviews] = useState([]);
  const [notifications, setNotifications] = useState();
  const [showNotifications, setShowNotifications] = useState(false);

  let navigate = useNavigate();

  function handleLogOut() {
    logOut();
    navigate("/signin");
  }

  function handleNotificationClick(id) {
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
  }, [userReviews]);

  const notificationDropDown = notifications?.map(notification => {
    return (
      <div
        className="header__notification-drop-down-message"
        onClick={e => handleNotificationClick(notification.reviewId)}
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
            <span className="header__notification-number">
              {notifications?.length}
            </span>
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
