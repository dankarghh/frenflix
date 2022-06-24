import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    user?.email ? navigate("./newsfeed") : navigate("./signin");
  }, []);

  return <div></div>;
}

export default Home;
