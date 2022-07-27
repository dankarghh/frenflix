import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";

import {
  onSnapshot,
  collection,
  query,
  doc,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";

function Header() {
  const {
    user,
    logOut,
    loggedInUser,
    setLoggedInUser,
    setNotificationClicked,
  } = useContext(AuthContext);

  const [userReviews, setUserReviews] = useState([]);
  const [notifications, setNotifications] = useState();
  const [showNotifications, setShowNotifications] = useState(false);

  let navigate = useNavigate();

  function handleLogOut() {
    logOut();

    navigate("signin");
  }

  async function handleNotificationClick(reviewId, notificationId) {
    const filteredNotifications = notifications.filter(
      notification => notification.reviewId === reviewId
    );
    const newNotifications = filteredNotifications.filter(
      notification => notification.notificationId !== notificationId
    );

    try {
      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, {
        notifications: newNotifications,
      });
    } catch (error) {
      console.log(error);
    }
    setNotificationClicked(true);
    navigate({
      pathname: "/newsfeed",
      search: `?id=${reviewId}`,
    });

    toggleNotificationMenu();
  }

  function toggleNotificationMenu() {
    document
      .querySelector(".header__notification-drop-down")
      .classList.toggle("hidden");
    setShowNotifications(prevState => !prevState);
  }

  function handleOpenSideMenu() {
    const sideNav = document.querySelector(".sidenav");
    sideNav.classList.toggle("open-modal");
  }

  useEffect(() => {
    if (loggedInUser?.id === undefined) {
      setUserReviews([]);
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
  }, [loggedInUser, user]);

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

  const notificationDropDown =
    notifications?.length > 0 ? (
      notifications.map(notification => {
        return (
          <div
            className="header__notification-drop-down-message"
            onClick={e =>
              handleNotificationClick(
                notification.reviewId,
                notification.notificationId
              )
            }
          >
            {notification.message}
          </div>
        );
      })
    ) : (
      <div className="header__notification-drop-down-message">
        No new notifications
      </div>
    );

  return (
    <div className="header">
      <Link to="/newsfeed">
        <h1
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
          className="header__heading"
        >
          CRITICS
        </h1>
      </Link>

      {user?.email ? (
        <div className="btn-container">
          <Link to="./review">
            <span class="material-symbols-outlined header-icon">
              edit_document
            </span>
          </Link>
          <span
            onClick={handleOpenSideMenu}
            class="material-symbols-outlined header-icon"
          >
            group
          </span>
          <Link to={`/profile/${loggedInUser?.username}`}>
            <span class="material-symbols-outlined  header-icon">
              account_circle
            </span>
            <p className="header__heading--profile"> Profile</p>
          </Link>
          <span
            onClick={toggleNotificationMenu}
            className="material-symbols-outlined header__notification-container"
          >
            notifications
            {notifications?.length > 0 && (
              <p className="header__notification-number">
                {notifications?.length}
              </p>
            )}
          </span>
          <button className="btn btn--logout" onClick={handleLogOut}>
            <span class="material-symbols-outlined  header-icon">logout</span>
            <p className="btn--logout-text ">Logout</p>
          </button>
          <div className="header__notification-drop-down hidden">
            {notificationDropDown}
          </div>
        </div>
      ) : (
        <div className="btn-container">
          <Link to="/newuser">
            <button className="btn btn--signed-out">Sign Up</button>
          </Link>
          <Link to="/signin">
            <button className="btn btn--signed-out">Log In</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
