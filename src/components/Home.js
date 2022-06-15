import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return <div>{user ? navigate("./newsfeed") : navigate("./signin")}</div>;
}

export default Home;
