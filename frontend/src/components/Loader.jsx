import logo from "../assets/logo.png";

function Loader() {
  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50">
      
      {/* LOGO */}
      <div className="relative">
        <img
          src={logo}
          alt="IntelliVent"
          className="w-20 h-20 object-contain animate-pulse"
        />

        {/* GLOW */}
        <div className="absolute inset-0 rounded-full bg-orange-500 blur-3xl opacity-20 animate-ping"></div>
      </div>

      {/* TITLE */}
      <h1 className="mt-6 text-3xl font-bold text-orange-500 tracking-wide">
        IntelliVent
      </h1>

      {/* SUBTEXT */}
      <p className="text-gray-400 mt-2 text-sm">
        Preparing your workspace...
      </p>

      {/* LOADING BAR */}
      <div className="w-56 h-1 bg-gray-800 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-orange-500 animate-loader rounded-full"></div>
      </div>
    </div>
  );
}

export default Loader;