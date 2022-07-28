/* eslint-disable react-hooks/exhaustive-deps */
import { arrayUnion, updateDoc, doc } from "firebase/firestore";
import React, { useEffect, useState, useContext } from "react";

import { auth, db } from "../firebase-config";
import AuthContext from "../AuthContext";
import SideNav from "./SideNav";
import NewsfeedReview from "./NewsfeedReview";
import { useSearchParams, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

function Newsfeed() {
  const {
    user,
    loggedInUser,
    allUsers,
    allReviews,
    notificationClicked,
    setNotificationClicked,
  } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const searchId = searchParams.get("id");

  useEffect(() => {
    const searchId = searchParams.get("id");

    if (!searchId) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/signIn");
    }
  });

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
      reviewLinked.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setNotificationClicked(false);
  }

  useEffect(() => {
    navigateToNotification(searchId);
  }, [searchId]);

  async function addComment(e, id, author) {
    e.preventDefault();
    // const userRef = doc(db, "users", user?.email);
    const reviewRef = doc(db, "reviews", id);
    await updateDoc(reviewRef, {
      comments: arrayUnion({
        body: comment,
        author: loggedInUser.username,
      }),
    });

    if (loggedInUser.id === author) {
      setComment("");
      return;
    } else {
      await updateDoc(reviewRef, {
        notifications: arrayUnion({
          message: `${loggedInUser.username} commented on your review`,
          notificationId: uuid(),
          reviewId: id,
          read: false,
        }),
      });
    }

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
