import { arrayUnion, Firestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState, useContext } from "react";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import AuthContext from "../AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const [allReviews, setAllReviews] = useState([]);
  const reviewCollectionRef = collection(db, "reviews");
  const [comment, setComment] = useState("");

  async function getReviews() {
    const data = await getDocs(reviewCollectionRef);
    setAllReviews(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  }

  useEffect(() => {
    getReviews();
  }, []);

  async function addComment(e, id) {
    e.preventDefault();
    const reviewRef = doc(db, "reviews", id);

    await updateDoc(reviewRef, {
      comments: arrayUnion({
        body: comment,
        author: user.email,
      }),
    });

    setComment("");
  }

  const allReviewElements = allReviews.map(review => {
    return (
      <div className="home__review-container">
        <p>{review.author}</p>
        <img
          className="home__review-img"
          src={`https://image.tmdb.org/t/p/w500/${review.movie.poster_path}`}
          alt=""
        ></img>
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

  return <div className="home">{allReviewElements}</div>;
}

export default Home;
