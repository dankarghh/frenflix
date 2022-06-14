import { Firestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

function Home() {
  const [allReviews, setAllReviews] = useState([]);

  async function getReviews() {
    const querySnapshot = await getDocs(collection(db, "reviews"));
    setAllReviews(querySnapshot);
    console.log(allReviews);
  }

  useEffect(() => {
    getReviews();
  }, []);

  return <div>Home</div>;
}

export default Home;
