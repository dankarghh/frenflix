/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Home() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(auth);

  useEffect(() => {
    auth.currentUser === null ? navigate("/signin") : navigate("/newsfeed");
  }, []);

  return <div></div>;
}

export default Home;
