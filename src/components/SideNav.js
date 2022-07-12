import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { Link } from "react-router-dom";

function SideNav() {
  const userCollectionRef = collection(db, "users");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const resp = await getDocs(userCollectionRef);
      const data = await resp.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAllUsers(data);
    }
    getUsers();
  }, []);

  const mappedUsers = allUsers.map(user => {
    return (
      <Link to={`/profile/${user?.username}`}>
        <div className="sideNav__user">
          {user?.username}
          <div className="sideNav__user-critic-badge">{user?.criticRating}</div>
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
