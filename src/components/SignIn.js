import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";

function SignIn() {
  const { logIn, loggedInUser, auth } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    auth.currentUser && navigate("/newsfeed");
  }, [auth, loggedInUser]);

  async function handleSignIn(e, email, password) {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMsg("");
      await logIn(email, password);
      setLoading(false);
      navigate("/newsfeed");
    } catch (error) {
      setLoading(false);
      setErrorMsg("Username/Password not found");
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
        <div className="signIn__error-message">{errorMsg}</div>
        <button
          type="submit"
          onClick={e => handleSignIn(e, email, password)}
          className="btn"
        >
          {loading ? <p>SIGNING IN...</p> : <p>LOG IN</p>}
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
