import React, { useContext, useEffect, useState } from "react";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import AuthContext from "../AuthContext";
import { db } from "../firebase-config";
import { useParams } from "react-router-dom";

function NewsfeedReview(props) {
  const [postAuthor, setPostAuthor] = useState({});
  const [vote, setVote] = useState();
  const [liked, setLiked] = useState();
  const [disliked, setDisliked] = useState();
  const { user, loggedInUser } = useContext(AuthContext);
  const { id } = useParams();

  // use effect to find if user has already liked/diliked post

  useEffect(() => {
    if (props.upVotes.includes(user?.email)) {
      setVote(1);
    } else if (props.downVotes.includes(user?.email)) {
      setVote(-1);
    } else {
      setVote(0);
    }
  }, []);

  // getting author object to access username/criticrating
  useEffect(() => {
    function findAuthor(email) {
      const author = props.allUsers.find(user => user.id === email);
      setPostAuthor(author);
    }
    findAuthor(props.author);
  }, []);

  function upVote() {
    let newVote = "";
    if (vote === 1) {
      newVote = 0;
    } else if (vote === -1 || vote === 0) {
      newVote = 1;
    }
    setVote(newVote);
    castVote(newVote);
  }

  function downVote() {
    let newVote = "";
    if (vote === -1) {
      newVote = 0;
    } else if (vote === 1 || vote === 0) {
      newVote = -1;
    }
    setVote(newVote);
    castVote(newVote);
  }

  async function castVote(newVote) {
    const reviewDoc = doc(db, "reviews", props.id);

    if (newVote === 0) {
      let upVoteArr = props.upVotes.filter(vote => vote !== user.email);
      let downVoteArr = props.downVotes.filter(vote => vote !== user.email);
      await updateDoc(reviewDoc, { upVotes: upVoteArr });
      await updateDoc(reviewDoc, { downVotes: downVoteArr });
    } else if (newVote === 1 && !props.upVotes.includes(user.email)) {
      let downVoteArr = props.downVotes.filter(vote => vote !== user.email);
      await updateDoc(reviewDoc, { upVotes: arrayUnion(user.email) });
      await updateDoc(reviewDoc, { downVotes: downVoteArr });
      await updateDoc(reviewDoc, {
        notifications: arrayUnion({
          message: `${loggedInUser.username} liked your review`,
          id: Math.random() * 4,
          reviewId: props.id,
          read: false,
        }),
      });
    } else if (newVote === -1 && !props.downVotes.includes(user.email)) {
      let upVoteArr = props.upVotes.filter(vote => vote !== user.email);
      await updateDoc(reviewDoc, { downVotes: arrayUnion(user.email) });
      await updateDoc(reviewDoc, { upVotes: upVoteArr });
      await updateDoc(reviewDoc, {
        notifications: arrayUnion({
          message: `${loggedInUser.username} thought your review was trash`,
          id: Math.random() * 4,
          reviewId: props.id,
          read: false,
        }),
      });
    }
  }

  return (
    <div className="home__review-container" id={props.id}>
      <img
        className="home__review-img"
        src={`https://image.tmdb.org/t/p/w500/${props.posterPath}`}
        alt=""
      ></img>
      <div className="home__review-caption">
        <p>{postAuthor?.username}</p>
        <div className="home__review-vote-container">
          <span
            onClick={upVote}
            className={
              vote === 1
                ? "material-symbols-outlined home__review-vote-icon green"
                : "material-symbols-outlined home__review-vote-icon "
            }
          >
            thumb_up
          </span>
          <span className="home__review-container-likes">
            {props.upVotes.length > 0 ? props.upVotes.length : null}
          </span>
          <span
            onClick={downVote}
            className={
              vote === -1
                ? "material-symbols-outlined home__review-vote-icon red"
                : "material-symbols-outlined home__review-vote-icon"
            }
          >
            thumb_down
          </span>
          <span className="home__review-container-dislikes">
            {props.downVotes.length > 0 ? props.downVotes.length : null}
          </span>
        </div>
      </div>
      <h3>Rating: {props.rating}/5</h3>
      <p>
        <b>{props.summary}</b>
      </p>
      <p>{props.reviewBody}</p>

      <div className="home__comment-container">
        <div className="user-initials">
          {props.user?.email[0].toUpperCase()}
        </div>{" "}
        <form onSubmit={e => props.addComment(e, props.id)}>
          <input
            value={props.comment}
            name="comment"
            onChange={e => props.setComment(e.target.value)}
            className="input--comment"
            placeholder="Write a comment..."
          ></input>
        </form>
      </div>
      <div className="home__review-comments">
        {props.comments.map(comment => {
          return (
            <div className="home__comment-container">
              <div className="user-initials">
                {comment.author[0].toUpperCase()}
              </div>
              <div className="home__comment-content">
                <p className="home__comment-content-author">{comment.author}</p>
                <p className="home__comment-content-body">{comment.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NewsfeedReview;
