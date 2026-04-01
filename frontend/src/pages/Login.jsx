import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

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
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />

          <button
            onClick={() => navigate("/dashboard")}
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