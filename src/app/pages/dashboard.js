"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:5000/protected", { withCredentials: true })
      .then(({ data }) => setUser(data.user))
      .catch(() => router.push("/"));
  }, [router]);

  const logout = async () => {
    await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-semibold">Welcome, {user?.username}!</h1>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
