import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/user", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => window.location.href = "/auth");
  }, []);

  return (
    <div>
      <h1>Welcome, {user?.fullName || "User"}</h1>
      <button onClick={() => axios.post("http://localhost:5000/api/logout").then(() => window.location.href = "/")}>
        Logout
      </button>
    </div>
  );
}
