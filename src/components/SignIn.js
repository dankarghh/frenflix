import React, { useState } from "react";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
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
        <button className="btn">LOG IN</button>
        <div>
          <p>Not yet signed up? </p>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
