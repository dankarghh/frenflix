import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Home() {
  const { user, loggedInUser, auth } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(auth);

  useEffect(() => {
    auth.currentUser?.email === null
      ? navigate("/signin")
      : navigate("/newsfeed");
  }, [auth]);

  return <div></div>;
}

export default Home;
