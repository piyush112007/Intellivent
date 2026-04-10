import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // 🔥 SAVE AUTH DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      console.log("LOGGED IN USER:", res.data.user);

      navigate("/dashboard");
    } catch (err) {
      console.log(err);

      const message =
        err.response?.data?.message ||
        "Invalid credentials. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
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
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* SIGNUP */}
        <p className="text-sm text-center mt-6 text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;