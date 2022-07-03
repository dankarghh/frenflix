import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Home() {
  const { user, loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loggedInUser?.username ? navigate("./newsfeed") : navigate("./signin");
  }, []);

  return <div></div>;
}

export default Home;
