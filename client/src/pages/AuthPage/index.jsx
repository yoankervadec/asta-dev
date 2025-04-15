//
// client/src/pages/AuthPage/index.jsx

import React, { useState } from "react";
import { useLogin } from "../../hooks/fetch/auth/useAuth";

const AuthPage = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin(); // Hook for login

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ userName, password }); // Pass credentials to the login mutation
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loginMutation.isLoading}>
          {loginMutation.isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      {loginMutation.isError && <p>Error: {loginMutation.error?.message}</p>}
    </div>
  );
};

export default AuthPage;
