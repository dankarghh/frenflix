import {
  arrayUnion,
  onSnapshot,
  updateDoc,
  doc,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState, useContext } from "react";

import { db } from "../firebase-config";
import AuthContext from "../AuthContext";
import SideNav from "./SideNav";
import NewsfeedReview from "./NewsfeedReview";

function Newsfeed() {
  const { user, loggedInUser } = useContext(AuthContext);
  const [allReviews, setAllReviews] = useState([]);
  const [comment, setComment] = useState("");

  const userCollectionRef = collection(db, "users");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), snapshot => {
      setAllReviews(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  }, []);

  async function addComment(e, id) {
    e.preventDefault();
    const userRef = doc(db, "users", user?.email);
    // const userDetails = await getDoc(userRef);
    const reviewRef = doc(db, "reviews", id);
    await updateDoc(reviewRef, {
      comments: arrayUnion({
        body: comment,
        author: loggedInUser?.username,
      }),
    });
    // this block here is testing
    await updateDoc(reviewRef, {
      notifications: arrayUnion({
        from: loggedInUser.username,
        id: Math.random() * 4,
        reviewId: id,
      }),
    });
    setComment("");
  }

  useEffect(() => {
    async function getUsers() {
      const resp = await getDocs(userCollectionRef);
      const data = await resp.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAllUsers(data);
    }
    getUsers();
  }, []);

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
    <div className="newsfeed-container">
      <SideNav />
      <div className="newsfeed-column">{allReviewElements}</div>
    </div>
  );
}

export default Newsfeed;
