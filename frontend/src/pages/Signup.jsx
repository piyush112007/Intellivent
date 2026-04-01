import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", { name, email, password });
      alert("Signup successful ✅");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d')",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md bg-gray-900/80 text-white rounded-2xl shadow-xl p-8">
        
        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>
        <p className="text-center  mb-6 text-orange-600">
          Join IntelliVent
        </p>

        <div className="space-y-4">
          
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg placeholder-gray-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg placeholder-gray-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg placeholder-gray-400"
          />

          <button
            onClick={handleSignup}
            className="w-full bg-orange-600 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Signup
          </button>
        </div>

        <p className="text-sm text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-400 cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;