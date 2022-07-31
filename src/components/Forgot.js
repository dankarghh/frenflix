import React, { useContext, useState } from "react";
import AuthContext from "../AuthContext";
import { Link } from "react-router-dom";

function Forgot() {
  const { resetPassword } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleResend(e, email) {
    try {
      e.preventDefault();
      setErrorMsg("");
      setLoading(true);
      await resetPassword(email);
      setEmail("");
      setSuccessMsg(
        `Password reset email successfully sent. Can't see it? Make sure to check junk mail.`
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMsg(
        "Could not reset password. Please check email address and try again"
      );
    }
  }

  return (
    <div className="form__container">
      <form className="form form__new-user">
        <h2 className="forgot__heading">Forgot Password?</h2>

        <input
          name="email"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        ></input>

        <button
          className="btn"
          type="submit"
          onClick={e => handleResend(e, email)}
        >
          {loading ? <p>SENDING RESET EMAIL</p> : <p>RESET PASSWORD</p>}
        </button>
        <div>
          <p>{successMsg}</p>
          <p>{errorMsg}</p>
        </div>
        <p>
          <Link to="/signin">Back to Login</Link>{" "}
        </p>
      </form>
    </div>
  );
}

export default Forgot;
