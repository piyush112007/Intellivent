import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // 🔥 SAVE USER (MOST IMPORTANT)
      localStorage.setItem(
        "user",
        JSON.stringify({ user: res.data.user })
      );

      console.log("LOGGED IN USER:", res.data.user);

      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 dark"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-md text-white rounded-2xl shadow-xl p-8">
        
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-600">
          IntelliVent
        </h1>

        <div className="space-y-4">
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-orange-600 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Login
          </button>
        </div>

        <p className="text-sm text-center mt-6 text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 cursor-pointer"
          >
            Signup
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;