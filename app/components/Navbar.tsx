import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          JobAnalyzer
        </p>
      </Link>
      <div className="flex flex-row gap-4">
        <Link 
          to="/analyze-job" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
        >
          Analyze Job
        </Link>
        <button 
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors" 
          onClick={auth.signOut}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
