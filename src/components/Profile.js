import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import React from "react";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { db } from "../firebase-config";

import { useParams } from "react-router-dom";

function Profile() {
  const userCollectionRef = collection(db, "users");
  const { username } = useParams();
  const { user, loggedInUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [about, setAbout] = useState("");
  const [editAbout, setEditAbout] = useState(false);
  const [ownProfile, setOwnProfile] = useState(false);
  const [userReviews, setUserReviews] = useState([]);

  const loggedInUserID = loggedInUser?.id;

  function setDefaults() {
    setAbout(
      loggedInUser?.about ||
        "Add a few sentences about yourself to help your fellow movie buffs get to know you."
    );
  }

  useEffect(() => {
    async function getUsersAndFindProfile(username) {
      const resp = await getDocs(userCollectionRef);
      const data = resp.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const userProfileData = data.find(user => user.username === username);
      setUserData(userProfileData);
    }
    getUsersAndFindProfile(username);
    if (loggedInUser?.username === username) {
      setOwnProfile(true);
    }
  }, []);

  useEffect(() => {
    async function getUserReviews() {
      const reviewCollectionRef = collection(db, "reviews");
      try {
        const res = await getDocs(reviewCollectionRef);
        const data = await res.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        const userReviewArr = data.filter(
          review => review.author === user.email
        );
        setUserReviews(userReviewArr);
      } catch (error) {
        console.log(error);
      }
    }
    getUserReviews();
  }, []);

  const userReviewElements = userReviews?.map(review => {
    return (
      <div className="profile__user-review">
        <div className="profile__user-review-img">
          <img
            alt=""
            src={`https://image.tmdb.org/t/p/w500/${review.movie.poster_path}`}
          />
        </div>
        <div className="profile__user-review-rating">
          <span className="material-symbols-outlined">
            {review.rating > 0 ? "star" : "grade"}
          </span>
          <span className="material-symbols-outlined">
            {review.rating > 1 ? "star" : "grade"}
          </span>
          <span className="material-symbols-outlined">
            {review.rating > 2 ? "star" : "grade"}
          </span>
          <span className="material-symbols-outlined">
            {review.rating > 3 ? "star" : "grade"}
          </span>
          <span className="material-symbols-outlined">
            {review.rating > 4 ? "star" : "grade"}
          </span>
        </div>
        <p className="profile__user-review-summary">{review.summary}</p>
      </div>
    );
  });

  async function editAboutMe() {
    try {
      const loggedInUserRef = doc(db, "users", `${loggedInUserID}`);

      await updateDoc(loggedInUserRef, { about: about });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="profile">
      <div className="profile__info">
        <div className="profile__photo"></div>
        <div className="profile__about">
          <h1 className="profile__about-heading--main">
            {userData?.username}{" "}
          </h1>
          <div className="profile__about-heading">
            <h2>Critic Rating: </h2>
            <div className="profile__about-rating-badge">
              <h3>{userData?.criticRating}</h3>
            </div>
          </div>

          <div>
            <div className="profile__about-heading">
              <h3>About</h3>
              {ownProfile && (
                <span
                  onClick={e => setEditAbout(true)}
                  className="material-symbols-outlined"
                >
                  edit
                </span>
              )}
            </div>
            <p className="profile__about-content">
              {userData?.about
                ? userData.about
                : "Add a few sentences about yourself to help your fellow movie buffs get to know you."}
            </p>
          </div>
          {editAbout && (
            <div>
              {" "}
              <textarea
                className="profile__about-input"
                name="about"
                value={about}
                onChange={e => setAbout(e.target.value)}
              ></textarea>
              <button onClick={e => editAboutMe} className="btn">
                Enter
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="profile__reviews">
        <h1>Reviews</h1>

        <div className="profile__review-container">{userReviewElements}</div>
      </div>
    </div>
  );
}

export default Profile;
