import {
  arrayUnion,
  updateDoc,
  doc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import React, { useEffect, useState, useContext } from "react";

import { db } from "../firebase-config";
import AuthContext from "../AuthContext";
import SideNav from "./SideNav";
import NewsfeedReview from "./NewsfeedReview";
import { useSearchParams, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

function Newsfeed() {
  const {
    user,
    loggedInUser,
    auth,
    findLoggedInUser,
    allUsers,
    allReviews,
    notificationClicked,
    setNotificationClicked,
  } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  // const [searchId, setSearchId] = useState(null);

  useEffect(() => {
    if (!loggedInUser) {
      findLoggedInUser(user.email);
    }
  }, []);

  const navigate = useNavigate();
  const searchId = searchParams.get("id");

  // useEffect(() => {
  //   if (auth.currentUser === null) {
  //     navigate("/signin");
  //   }
  // }, []);

  useEffect(() => {
    if (notificationClicked === false) {
      return;
    } else {
      const reviewId = searchParams.get("id");
      navigateToNotification(reviewId);
      setNotificationClicked(false);
    }
  }, [notificationClicked]);

  function navigateToNotification(reviewId) {
    const reviewLinked = document.getElementById(reviewId);

    if (reviewLinked) {
      reviewLinked.scrollIntoView(false);
    }
    setNotificationClicked(false);
  }

  useEffect(() => {
    navigateToNotification(searchId);
  }, [searchId]);

  async function addComment(e, id) {
    e.preventDefault();
    // const userRef = doc(db, "users", user?.email);
    const reviewRef = doc(db, "reviews", id);
    await updateDoc(reviewRef, {
      comments: arrayUnion({
        body: comment,
        author: loggedInUser.username,
      }),
    });

    await updateDoc(reviewRef, {
      notifications: arrayUnion({
        message: `${loggedInUser.username} commented on your review`,
        notificationId: uuid(),
        reviewId: id,
        read: false,
      }),
    });
    setComment("");
  }

  const allReviewElements = allReviews.map(review => {
    return (
      <NewsfeedReview
        key={review.id}
        author={review.author}
        summary={review.summary}
        reviewBody={review.reviewBody}
        id={review.id}
        user={user}
        addComment={addComment}
        comment={comment}
        setComment={setComment}
        posterPath={review.movie.poster_path}
        comments={review.comments}
        allUsers={allUsers}
        rating={review.rating}
        upVotes={review.upVotes}
        downVotes={review.downVotes}
      />
    );
  });

  return (
    <div className="main">
      <SideNav />
      <div className="newsfeed-container">
        <div className="newsfeed-column">{allReviewElements}</div>
      </div>
    </div>
  );
}

export default Newsfeed;
