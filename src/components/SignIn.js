import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";

function SignIn() {
  const { logIn, user, loggedInUser, auth } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    auth.currentUser && navigate("/newsfeed");
  });

  async function handleSignIn(e, email, password) {
    e.preventDefault();

    try {
      await logIn(email, password);
      navigate("/newsfeed");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="form__container">
      {" "}
      <form className="form form__sign-in">
        <h2>Log in to your account</h2>

        <input
          name="email"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        ></input>
        <input
          value={password}
          name="password"
          placeholder="password"
          type="password"
          onChange={e => setPassword(e.target.value)}
        ></input>
        <button
          type="submit"
          onClick={e => handleSignIn(e, email, password)}
          className="btn"
        >
          LOG IN
        </button>
        <div>
          <p>
            Not yet signed up? <Link to="/newuser">Sign Up</Link>{" "}
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
