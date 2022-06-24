import React, { useContext } from "react";
import AuthContext from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";

function Header() {
  const { user, logOut, loggedInUser } = useContext(AuthContext);
  let navigate = useNavigate();

  function handleLogOut() {
    logOut();
    navigate("/signin");
  }

  return (
    <div className="header">
      <Link to="/newsfeed">
        <h1 className="header__heading">FRENFLIX</h1>
      </Link>
      {/* {user && (
        <Link to="/profile">
          <span class="material-symbols-outlined">person</span>
          <p>Account</p>
        </Link>
      )} */}
      {user ? (
        <div className="btn-container">
          <Link to={`/profile/${loggedInUser.username}`}>
            <p>Profile</p>
          </Link>
          <button className="btn" onClick={handleLogOut}>
            Logout
          </button>
        </div>
      ) : (
        <div className="btn-container">
          <Link to="/newuser">
            <button className="btn">Sign Up</button>
          </Link>
          <Link to="/signin">
            <button className="btn">Log In</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
