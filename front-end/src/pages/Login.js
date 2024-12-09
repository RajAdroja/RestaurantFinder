import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "user@example.com") {
      setIsLoggedIn(true);
      setUserRole("user");
      navigate("/user/dashboard");
    } else if (email === "business@example.com") {
      setIsLoggedIn(true);
      setUserRole("business");
      navigate("/business/dashboard");
    } else if (email === "admin@example.com") {
      setIsLoggedIn(true);
      setUserRole("admin");
      navigate("/admin/dashboard");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
      <div className="p-6 max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-4">Login to MunchMap</h1>
        <form onSubmit={handleLogin}>
          <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
          <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-green-600 text-white p-2 w-full rounded">
            Login
          </button>
        </form>
      </div>
  );
}

export default Login;
