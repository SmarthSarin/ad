"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "register";
    try {
      await axios.post(`http://localhost:5000/${endpoint}`, user, { withCredentials: true });

      if (isLogin) {
        router.push("/dashboard"); // Redirect to protected page
      } else {
        alert("User registered! Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleAuth}>
          <input type="text" placeholder="Username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} className="w-full p-2 mb-2 border rounded" required />
          <input type="password" placeholder="Password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} className="w-full p-2 mb-4 border rounded" required />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-sm text-blue-600 cursor-pointer mt-3" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
