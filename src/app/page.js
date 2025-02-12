"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    setMounted(true);
    if (session) {
      router.replace("/homePage");
    }
  }, [session, router]);

  if (!mounted)
    return <div className="min-h-screen bg-white dark:bg-black"></div>;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    // Proceed with login/signup logic
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 transition-all duration-300 relative">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/site-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: theme === "light" ? "invert(1)" : "none",
        }}
      />

      {/* Title */}
      <h1 className="text-4xl font-bold text-center tracking-wide leading-tight transition-all duration-300">
        <span
          className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
                   bg-clip-text text-transparent dark:from-blue-500 
                   dark:via-purple-500 dark:to-pink-500"
        >
          W3LCOME To Task Manager Web Application
        </span>
      </h1>

      {/* Get Started Button */}
      {!showLogin && !showSignup && (
        <motion.button
          onClick={() => setShowLogin(true)}
          className="mt-6 px-6 py-3 text-white font-semibold rounded-lg shadow-lg 
                   transition-all hover:scale-105 active:scale-95 
                   bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
                   dark:from-blue-500 dark:via-purple-500 dark:to-pink-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          Click Here to Get Started
        </motion.button>
      )}

      {/* Login & Signup Form */}
      {(showLogin || showSignup) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 p-6 bg-white/30 dark:bg-gray-800/50 backdrop-blur-md rounded-lg shadow-lg w-80"
        >
          <h2 className="text-xl font-serif italic tracking-wider text-center mb-4 text-[#C4A28D] dark:text-white">
            {showSignup ? "Create an Account" : "Connect to your account"}
          </h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded-lg bg-[#E5C9BD] dark:bg-gray-700 dark:text-white placeholder-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
          />
          <div className="relative mb-3">
            {" "}
            {/* Relative positioning for the button */}
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              placeholder="Password"
              className="w-full p-2 border rounded-lg bg-[#E5C9BD] dark:bg-gray-700 dark:text-white placeholder-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
            <button
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 flex   items-center justify-center "
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}{" "}
              {/* Toggle icon */}
            </button>
          </div>

          {/* Show Confirm Password for Signup */}
          {showSignup && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 mb-3 border rounded-lg bg-[#E5C9BD] dark:bg-gray-700 dark:text-white placeholder-gray-600"
            />
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-2 rounded-lg font-semibold transition-all 
                   bg-[#D2B7A3] text-[#3A2F2A] hover:bg-[#C4A28D] 
                   dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
          >
            {showSignup ? "Sign Up" : "Login"}
          </button>

          {/* Google Login */}
          <button
            onClick={() => signIn("google")}
            className="w-full mt-3 py-2 rounded-lg font-semibold flex items-center justify-center transition-all 
                   bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 
                   dark:bg-gray-700 dark:text-white dark:border-gray-500 dark:hover:bg-gray-600"
          >
            <FcGoogle className="text-2xl mr-2" /> {/* Google Icon */}
            {showSignup ? "Sign up with Google" : "Login with Google"}
          </button>

          {/* Toggle Between Login & Signup */}
          <p className="text-center text-sm mt-3 text-gray-600 dark:text-gray-300">
            {showSignup ? "Already have an account?" : "Don't have an account?"}
            <span
              className="text-blue-500 cursor-pointer hover:underline ml-1"
              onClick={() => {
                setShowSignup(!showSignup);
                setShowLogin(!showLogin);
              }}
            >
              {showSignup ? "Login" : "Sign Up"}
            </span>
          </p>

          <div className="text-center mt-4">
            <span className="text-gray-500">or</span>
            <button
              onClick={() => router.push("/homePage")}
              className="block w-full mt-2 py-2 px-4 rounded-lg font-semibold transition-all 
                bg-gray-200 text-gray-700 hover:bg-gray-300 
                dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Continue as Guest
            </button>
          </div>
        </motion.div>
      )}

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed bottom-4 right-4 w-16 h-16 flex items-center justify-center 
                   bg-white/30 dark:bg-gray-900/50 backdrop-blur-md 
                   rounded-full shadow-lg transition-all 
                   hover:scale-110 active:scale-95"
      >
        <img
          src={theme === "light" ? "/L.png" : "/D.png"}
          alt="Theme Toggle Icon"
          className="w-10 h-10 object-contain"
        />
      </button>
    </div>
  );
}
