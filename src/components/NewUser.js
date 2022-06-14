import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function NewUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { createAccount, auth, setUser, user } = useContext(AuthContext);

  async function handleSignUp(e) {
    e.preventDefault();
    try {
      await createAccount(email, password, username);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <form className="form form__new-user">
        <h2>Create Account</h2>
        <input
          name="username"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        ></input>
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
        <button className="btn" type="button" onClick={e => handleSignUp(e)}>
          SIGN UP
        </button>
        <div>
          <p>
            Already have an account? <Link to="SignIn">Sign In</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default NewUser;
