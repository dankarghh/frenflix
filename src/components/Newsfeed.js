import {
  arrayUnion,
  Firestore,
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

function Newsfeed() {
  const { user } = useContext(AuthContext);
  const [allReviews, setAllReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [reviewer, setReviewer] = useState({});
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
    const userRef = doc(db, "users", user.email);
    const userDetails = await getDoc(userRef);
    console.log(userDetails);
    const reviewRef = doc(db, "reviews", id);
    await updateDoc(reviewRef, {
      comments: arrayUnion({
        body: comment,
        author: user.email,
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
      <div className="home__review-container">
        <img
          className="home__review-img"
          src={`https://image.tmdb.org/t/p/w500/${review.movie.poster_path}`}
          alt=""
        ></img>
        <div className="home__review-caption">
          <p>{review.author}</p>

          <div className="home__review-vote-container">
            <span className="material-symbols-outlined home__review-vote-icon">
              thumb_up
            </span>
            <span className="material-symbols-outlined home__review-vote-icon">
              thumb_down
            </span>
          </div>
        </div>
        <h3>Rating: {review.rating}/5</h3>
        <p>
          <b>{review.summary}</b>
        </p>
        <p>{review.reviewBody}</p>

        <div className="home__comment-container">
          <div className="user-initials">{user?.email[0].toUpperCase()}</div>{" "}
          <form onSubmit={e => addComment(e, review.id)}>
            <input
              value={comment}
              name="comment"
              onChange={e => setComment(e.target.value)}
              className="input--comment"
              placeholder="Write a comment..."
            ></input>
          </form>
        </div>
        <div className="home__review-comments">
          {review.comments.map(comment => {
            return (
              <div className="home__comment-container">
                <div className="user-initials">
                  {comment.author[0].toUpperCase()}
                </div>
                <div className="home__comment-content">
                  <p className="home__comment-content-author">
                    {comment.author}
                  </p>
                  <p className="home__comment-content-body">{comment.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <div className="newsfeed-container">
      <SideNav />
      <div>{allReviewElements}</div>
    </div>
  );
}

export default Newsfeed;
