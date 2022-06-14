import React, { useContext } from "react";
import AuthContext from "../AuthContext";
import { Link } from "react-router-dom";

function Header() {
  const { user, logOut } = useContext(AuthContext);
  console.log(user);
  return (
    <div className="header">
      <Link to="/home">
        <h1 className="header__heading">FRENFLIX</h1>
      </Link>
      {user && (
        <Link to="/profile">
          <span class="material-symbols-outlined">person</span>
          <p>Account</p>
        </Link>
      )}
      {user ? (
        <div>
          <p>{user.name}</p>
          <button className="btn" onClick={logOut}>
            Logout
          </button>
        </div>
      ) : (
        <button>Log In</button>
      )}
    </div>
  );
}

export default Header;
