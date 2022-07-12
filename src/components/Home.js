import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Home() {
  const { user, loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    user.email !== null ? navigate("./newsfeed") : navigate("./signin");
  }, [user]);

  return <div></div>;
}

export default Home;
