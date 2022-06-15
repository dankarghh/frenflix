import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { isReactNative } from "@firebase/util";
import { Link } from "react-router-dom";

function SideNav() {
  const userCollectionRef = collection(db, "users");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const resp = await getDocs(userCollectionRef);
      const data = resp.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAllUsers(data);
    }
    getUsers();
  }, []);

  const mappedUsers = allUsers.map(user => {
    return <div>{user.profile?.username}</div>;
  });
  return (
    <div className="sidenav">
      <h2>Users</h2>
      <div>{mappedUsers}</div>
      <Link to="/review">
        <h2>Write Review</h2>
      </Link>
    </div>
  );
}

export default SideNav;
