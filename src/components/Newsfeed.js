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
import { Element, ScrollElement } from "react-scroll";

import { db } from "../firebase-config";
import AuthContext from "../AuthContext";
import SideNav from "./SideNav";
import NewsfeedReview from "./NewsfeedReview";
import { useNavigate, useSearchParams } from "react-router-dom";

function Newsfeed() {
  const { user, loggedInUser } = useContext(AuthContext);
  const [allReviews, setAllReviews] = useState([]);
  const [comment, setComment] = useState("");
  const userCollectionRef = collection(db, "users");
  const [allUsers, setAllUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const reviewId = searchParams?.get("id");
    const reviewLinked = document.getElementById(reviewId);
    reviewLinked?.scrollIntoView();
  }, [searchParams]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), snapshot => {
      setAllReviews(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })).sort(function sortPosts(a, b){
        if (a.created < b.created ){
          return 1
        }
        if (a.created > b.created ) {
          return -1
        }
      }));
      
    });
    return unsubscribe;
  }, []);

// function sortPosts(a, b) {
//  if (a.created < b.created ){
//     return -1
//   }
//   if (a.created > b.created ) {
//     return 1
//   }
// }
// useEffect(()=> {
// console.log(allReviews)
// setAllReviews(prevState=> prevState.sort(function sortPosts(a, b){
//   if (a.created < b.created ){
//     return 1
//   }
//   if (a.created > b.created ) {
//     return -1
//   }
// }))
// },[allReviews])

  async function addComment(e, id) {
    e.preventDefault();
    const userRef = doc(db, "users", user?.email);
    // const userDetails = await getDoc(userRef);
    const reviewRef = doc(db, "reviews", id);
    await updateDoc(reviewRef, {
      comments: arrayUnion({
        body: comment,
        author: loggedInUser.username,
      }),
    });
    // this block here is testing
    await updateDoc(reviewRef, {
      notifications: arrayUnion({
        message: `${loggedInUser.username} commented on your review`,
        id: Math.random() * 4,
        reviewId: id,
        read: false,
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
    <div className="main">
      <SideNav />
    <div className="newsfeed-container">
      <div className="newsfeed-column">{allReviewElements}</div>
    </div>


    </div>
  );
}

export default Newsfeed;
