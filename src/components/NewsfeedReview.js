import React, { useContext, useEffect, useState } from "react";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import AuthContext from "../AuthContext";
import { db } from "../firebase-config";
import { useParams, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";

function NewsfeedReview(props) {
  const [postAuthor, setPostAuthor] = useState({});
  const [vote, setVote] = useState();

  const { user, loggedInUser } = useContext(AuthContext);
  const { id } = useParams();
  const [likeHover, setLikeHover] = useState(false);
  const [dislikeHover, setDislikeHover] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    if (props.comments.length < 4) {
      setShowAllComments(true);
    }
  }, [props]);

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
  }, [props]);

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

      if (loggedInUser.username === postAuthor.username) {
        return;
      } else {
        await updateDoc(reviewDoc, {
          notifications: arrayUnion({
            message: `${loggedInUser.username} liked your review`,
            notificationId: uuid(),
            reviewId: props.id,
            read: false,
          }),
        });
      }
    } else if (newVote === -1 && !props.downVotes.includes(user.email)) {
      let upVoteArr = props.upVotes.filter(vote => vote !== user.email);
      await updateDoc(reviewDoc, { downVotes: arrayUnion(user.email) });
      await updateDoc(reviewDoc, { upVotes: upVoteArr });

      if (loggedInUser.username === postAuthor.username) {
        return;
      } else {
        await updateDoc(reviewDoc, {
          notifications: arrayUnion({
            message: `${loggedInUser.username} thought your review was trash`,
            notificationId: uuid(),
            reviewId: props.id,
            read: false,
          }),
        });
      }
    }
  }

  const likes = [];

  props.upVotes.forEach(vote => {
    const author = props.allUsers.find(user => user.id === vote);
    likes.push(<p>{author?.username}</p>);
  });

  const dislikes = [];

  props.downVotes.forEach(vote => {
    const author = props.allUsers.find(user => user.id === vote);
    dislikes.push(<p>{author?.username}</p>);
  });

  return (
    <div className="home__review-container" id={props.id}>
      <img
        className="home__review-img"
        src={`https://image.tmdb.org/t/p/w500/${props.posterPath}`}
        alt=""
      ></img>

      <div className="home__review-caption">
        {/* <Link to={`/profile/${postAuthor?.username}`}>
          {postAuthor?.username}
        </Link> */}
        <span className="home__review-rating-container">
          <span className="material-symbols-outlined home__review-rating-star">
            {props.rating > 0 ? "star" : "grade"}
          </span>
          <span className="material-symbols-outlined home__review-rating-star">
            {props.rating > 1 ? "star" : "grade"}
          </span>
          <span className="material-symbols-outlined home__review-rating-star">
            {props.rating > 2 ? "star" : "grade"}
          </span>
          <span className="material-symbols-outlined home__review-rating-star">
            {props.rating > 3 ? "star" : "grade"}
          </span>
          <span className="material-symbols-outlined home__review-rating-star">
            {props.rating > 4 ? "star" : "grade"}
          </span>
        </span>
        <div className="home__review-vote-container">
          <span className="home__review-upvote-container">
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
            <span
              onMouseEnter={e => setLikeHover(true)}
              onMouseLeave={e => setLikeHover(false)}
              className="home__review-container-likes"
            >
              {props.upVotes.length > 0 ? props.upVotes.length : null}
            </span>
            <span className={likeHover ? "likes" : "likes hidden"}>
              {likes}
            </span>
          </span>
          <span className="home__review-downvote-container">
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
            <span
              onMouseEnter={e => setDislikeHover(true)}
              onMouseLeave={e => setDislikeHover(false)}
              className="home__review-container-dislikes"
            >
              {props.downVotes.length > 0 ? props.downVotes.length : null}
            </span>
            <span className={dislikeHover ? "likes" : "likes hidden"}>
              {dislikes}
            </span>
          </span>
        </div>
      </div>
      <Link
        to={`/profile/${postAuthor?.username}`}
        className="home__review-container-username"
      >
        {postAuthor?.username}
      </Link>

      <p className="home__review-container-summary">
        <b>{props.summary}</b>
      </p>
      <p>{props.reviewBody}</p>

      <div className="home__comment-container">
        <div className="user-initials">
          {props.user?.email[0].toUpperCase()}
        </div>{" "}
        <form onSubmit={e => props.addComment(e, props.id, props.author)}>
          <input
            value={props.comment}
            name="comment"
            onChange={e => props.setComment(e.target.value)}
            className="input--comment"
            placeholder="Write a comment..."
          ></input>
        </form>
      </div>

      {showAllComments === true ? (
        <div className="home__review-comments">
          {props.comments.map(comment => {
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
          {props.comments.length > 3 && (
            <p
              onClick={e => setShowAllComments(false)}
              className="home__comment-view-all"
            >
              Hide comments
            </p>
          )}
        </div>
      ) : (
        <div className="home__review-comments">
          <div className="home__comment-container">
            <div className="user-initials">
              {props.comments[
                props.comments.length - 1
              ]?.author[0].toUpperCase()}
            </div>
            <div className="home__comment-content">
              <p className="home__comment-content-author">
                {props.comments[props.comments.length - 1]?.author}
              </p>
              <p className="home__comment-content-body">
                {props.comments[props.comments.length - 1]?.body}
              </p>
            </div>
          </div>

          <p
            onClick={e => setShowAllComments(true)}
            className="home__comment-view-all"
          >
            View {props.comments.length - 1} more comments
          </p>
        </div>
      )}
    </div>
  );
}

export default NewsfeedReview;
