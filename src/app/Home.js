import axios from "axios";

const [authMode, setAuthMode] = useState("login");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [fullName, setFullName] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (authMode === "login") {
      const { data } = await axios.post("http://localhost:5000/api/login", { email, password }, { withCredentials: true });
      alert(data.message);
      router.push("/dashboard");
    } else {
      const { data } = await axios.post("http://localhost:5000/api/register", { fullName, email, password });
      alert(data.message);
      setAuthMode("login");
    }
  } catch (error) {
    alert(error.response?.data?.error || "Something went wrong");
  }
};
