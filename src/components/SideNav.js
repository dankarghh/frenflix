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
  const [allUsers, setAllUsers] = useState([]);
  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), snapshot => {
      setAllReviews(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), snapshot => {
      setAllUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  });

  // useEffect(() => {
  //   async function getAllUsers() {
  //     try {
  //       const userCollectionRef = collection(db, "users");
  //       const resp = await getDocs(userCollectionRef);
  //       const data = resp.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  //       setAllUsers(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getAllUsers();
  // }, [allReviews]);

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
    calculateCriticScores();
  }, []);

  const mappedUsers = allUsers
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
        <Link to={`/profile/${user?.username}`}>
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
        <Link to="/review">
          <div className="sideNav__new-review">
            <h2>Write Review</h2>
            <span class="material-symbols-outlined icon--blue">add</span>
          </div>
        </Link>
        <h2>Users</h2>
        <div className="sideNav__users">{mappedUsers}</div>
      </div>
    </div>
  );
}

export default SideNav;
