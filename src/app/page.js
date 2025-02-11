"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black"></div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-8 transition-all duration-300 relative">
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

      <h1 className="text-3xl mt-6">Welcome to Task Manager</h1>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed bottom-4 right-4 w-16 h-16 flex items-center justify-center 
                   bg-white/30 dark:bg-gray-900/50 backdrop-blur-md 
                   rounded-full shadow-lg transition-all 
                   hover:scale-110 active:scale-95"
      >
        <Image
          src={theme === "light" ? "/l.png" : "/d.png"}
          alt="Theme Toggle Icon"
          width={48}
          height={48}
          className="w-10 h-10 object-contain"
          priority
        />
      </button>
    </div>
  );
}

