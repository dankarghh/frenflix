import {
  arrayUnion,
  onSnapshot,
  updateDoc,
  doc,
  collection,
  getDoc,
  orderBy,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState, useContext } from "react";

import { db } from "../firebase-config";
import AuthContext from "../AuthContext";
import SideNav from "./SideNav";
import NewsfeedReview from "./NewsfeedReview";
import { useSearchParams, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

function Newsfeed() {
  const { user, loggedInUser, auth, allReviews, allUsers } =
    useContext(AuthContext);

  const [comment, setComment] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchId, setSearchId] = useState(null);
  // const userCollectionRef = collection(db, "users");
  const reviewId = searchParams.get("id");
  const navigate = useNavigate();
  // useEffect(() => {
  //   setSearchId(reviewId);
  // });

  useEffect(() => {
    if (auth.currentUser === null) {
      navigate("/signin");
    }
  });

  function navigateToNotification() {
    const reviewLinked = document.getElementById(searchId);

    if (reviewLinked) {
      reviewLinked.scrollIntoView(false);
    }
  }

  useEffect(() => {
    navigateToNotification();
  }, [searchId, reviewId]);

  async function addComment(e, id) {
    e.preventDefault();
    const userRef = doc(db, "users", user?.email);
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
