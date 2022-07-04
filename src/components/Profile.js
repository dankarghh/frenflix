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
import { db, storage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { useParams } from "react-router-dom";
import SideNav from "./SideNav";

function Profile() {
  const userCollectionRef = collection(db, "users");
  const { username } = useParams();
  const { user, loggedInUser } = useContext(AuthContext);

  const [profileURL, setProfileURL] = useState("");
  const [userData, setUserData] = useState(null);
  const [about, setAbout] = useState("");
  const [editAbout, setEditAbout] = useState(false);
  const [ownProfile, setOwnProfile] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const loggedInUserID = loggedInUser?.id;

  useEffect(() => {
    async function getUsersAndFindProfile(username) {
      const resp = await getDocs(userCollectionRef);
      const data = resp.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const userProfileData = data.find(user => user.username === username);
      setUserData(userProfileData);
      getUserReviews(userProfileData);
      setProfileURL(userProfileData.profilePicURL);
      setAbout(
        userProfileData.about === ""
          ? `Oh no, looks like ${userProfileData.username} hasn't added any info yet`
          : userProfileData.about
      );
    }
    getUsersAndFindProfile(username);
    if (loggedInUser?.username === username) {
      setOwnProfile(true);
    }
  }, [username]);

  async function getUserReviews(userProfileData) {
    const reviewCollectionRef = collection(db, "reviews");
    try {
      const res = await getDocs(reviewCollectionRef);
      const data = await res.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const userReviewArr = data.filter(
        review => review.author === userProfileData?.id
      );
      setUserReviews(userReviewArr);
    } catch (error) {
      console.log(error);
    }
  }

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

  function uploadProfilePic() {
    if (profilePic === null) return;
    const imageRef = ref(
      storage,
      `profilepics/${profilePic.name + Math.random() * 4}`
    );
    uploadBytes(imageRef, profilePic).then(snapshot => {
      getDownloadURL(snapshot.ref).then(url => {
        setNewProfilePic(url);
        setProfileURL(url);
      });
    });
  }

  async function setNewProfilePic(url) {
    try {
      const loggedInUserRef = doc(db, "users", `${loggedInUserID}`);

      await updateDoc(loggedInUserRef, { profilePicURL: url });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEditAboutMe(e) {
    e.preventDefault();
    setEditAbout(false);
    try {
      const loggedInUserRef = doc(db, "users", `${loggedInUserID}`);

      await updateDoc(loggedInUserRef, { about: about });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="main">
      <SideNav />
    <div className="profile">
      <div className="profile__info">
        <div className="profile__photo">
          <img className="profile__profile-pic" src={profileURL} alt="" />
          <div className="profile__photo-edit">
            <input
              className="profile__photo-upload"
              accept="image/*"
              type="file"
              id="upload-pic"
              onChange={e => setProfilePic(e.target.files[0])}
            ></input>
            <label for="upload-pic">
              {" "}
              <span class="material-symbols-outlined">photo_camera</span>
            </label>
            <button className="btn" onClick={uploadProfilePic}>
              Upload
            </button>
          </div>
        </div>
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
            {editAbout ? (
              <div className="profile__about-edit">
                <textarea
                  className="profile__about-edit-input"
                  name="about"
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                ></textarea>
                <button onClick={e => handleEditAboutMe(e)} className="btn">
                  Enter
                </button>
              </div>
            ) : (
              <p className="profile__about-content">{about}</p>
            )}
          </div>
          {editAbout && <div> </div>}
        </div>
      </div>
      <div className="profile__reviews">
        <h1>Reviews</h1>
        {userReviews.length < 1 && (
          <p>{username} hasn't uploaded any reviews just yet.</p>
        )}
        <div className="profile__review-container">{userReviewElements}</div>
      </div>
    </div>
    </div>
  );
}

export default Profile;
