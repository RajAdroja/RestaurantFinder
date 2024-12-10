import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

function Login({ setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios
        .post(`${apiUrl}/api/auth/login`, { email, password })
        .then((response) => {
          const { token, role } = response.data;

          // Store the token securely (preferably in httpOnly cookies)
          localStorage.setItem("jwtToken", token);

          // Update app state
          setIsLoggedIn(true);
          setUserRole(role);

          // Redirect to role-specific dashboard
          if (role === "USER") navigate("/user/dashboard");
          else if (role === "BUSINESS_OWNER") navigate("/business/dashboard");
          else if (role === "ADMIN") navigate("/admin/dashboard");
        })
        .catch((error) => {
          console.error("Login error:", error.response?.data?.message || error.message);
          alert("Invalid login credentials!");
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again later.");
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
          className="block w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
