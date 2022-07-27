import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { Link } from "react-router-dom";
import AuthContext from "../AuthContext";

function SideNav() {
  const { allReviews, allUsers } = useContext(AuthContext);
  const [allUsersCopy, setAllUsersCopy] = useState([]);

  useEffect(() => {
    const copiedArr = allUsers.map(user => {
      return user;
    });
    setAllUsersCopy(copiedArr);
  }, [allReviews, allUsers]);

  function calculateCriticScores() {
    allUsers.forEach(user => {
      const resultArr = allReviews.filter(review => review.author === user.id);
      let currentRating = user.criticRating;

      let newRating = 8;
      if (resultArr.length === 0) {
        return;
      }
      for (let i = 0; i < resultArr.length; i++) {
        newRating = newRating + resultArr[i].upVotes.length;
        newRating = newRating - resultArr[i].downVotes.length;
      }
      if (newRating === currentRating) {
        return;
      } else {
        upDateCriticScore(user.id, newRating);
      }
    });
  }

  async function upDateCriticScore(email, newRating) {
    try {
      const userRef = doc(db, "users", email);
      await updateDoc(userRef, { criticRating: newRating });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (allUsers && allReviews) {
      calculateCriticScores();
    }
  }, [allReviews]);

  const mappedUsers = allUsersCopy
    .sort(function (a, b) {
      if (a.criticRating < b.criticRating) {
        return 1;
      }
      if (a.criticRating > b.criticRating) {
        return -1;
      }
    })
    .map(user => {
      return (
        <Link key={user.username} to={`/profile/${user?.username}`}>
          <div className="sideNav__user">
            {user?.username}
            <div className="sideNav__user-critic-badge">
              {user?.criticRating}
            </div>
          </div>
        </Link>
      );
    });

  return (
    <div className="sidenav__container">
      <div className="sidenav">
        <Link className="sidenav__new-review-link" to="/review">
          <div className="sideNav__new-review">
            <h2>Write Review</h2>
            <span class="material-symbols-outlined icon--blue">add</span>
          </div>
        </Link>
        <div>
          <h2 className="sideNav__users-heading">Users</h2>
          <div className="sideNav__users">{mappedUsers}</div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
