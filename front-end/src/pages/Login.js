import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      // Extract token and user role from response
      const { token, role } = response.data;

      // Store token in local storage or cookie for subsequent requests
      localStorage.setItem("authToken", token);

      // Update application state
      setIsLoggedIn(true);
      setUserRole(role);

      // Navigate to role-specific dashboard
      if (role === "user") {
        navigate("/user/dashboard");
      } else if (role === "business") {
        navigate("/business/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        throw new Error("Unknown role");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials or server error!");
    }
  };

  return (
      <div className="p-6 max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-4">Login to MunchMap</h1>
        <form onSubmit={handleLogin}>
          <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded mb-4"
          />
          <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded mb-4"
          />
          <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Login
          </button>
        </form>
      </div>
  );
}

export default Login;