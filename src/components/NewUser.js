import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function NewUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { createAccount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e) {
    e.preventDefault();
    if (username === "") {
      setUsernameErr("Username cannot be left blank");
      return;
    } else if (validateEmail(email) === false) {
      return;
    } else if (password.length < 6) {
      setPasswordErr("Password must contain at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await createAccount(email, password, username);
      setLoading(false);
      navigate("/newsfeed");
    } catch (error) {
      setLoading(false);
    }
  }

  function validateEmail(email) {
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
      return true;
    } else {
      setEmailErr("Please enter a valid email address");
      return false;
    }
  }

  return (
    <div className="form__container">
      <form className="form form__new-user">
        <h2>Create Account</h2>
        <input
          name="username"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        ></input>
        {usernameErr}
        <input
          name="email"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        ></input>
        {emailErr}
        <input
          value={password}
          name="password"
          placeholder="password"
          type="password"
          onChange={e => setPassword(e.target.value)}
        ></input>
        {passwordErr}
        <button className="btn" type="submit" onClick={e => handleSignUp(e)}>
          {loading ? <p>SIGNING UP...</p> : <p>SIGN UP</p>}
        </button>
        <div>
          <p>
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default NewUser;
