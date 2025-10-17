import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}
        <Link to="/">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap items-center gap-1">
          <span className="text-slate-500">Real</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        </Link>

        {/* Search form */}
        <form className="bg-slate-100 p-2 sm:p-3 rounded-lg flex items-center flex-shrink-0">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600 ml-2" />
        </form>

        {/* Navigation menu */}
        <ul className="flex gap-4 items-center">
            <Link to="/">          
            <li className="text-slate-700 hover:underline">Home</li>
            </Link>
            <Link to="/about">
            <li className="text-slate-700 hover:underline">About</li>
            </Link>
            <Link to="/profile">
            {currentUser ? (
              currentUser.photoURL ? (
                <img className="w-8 h-8 rounded-full object-cover" src={currentUser.photoURL} alt="profile" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs">U</div>
              )
            ) : (
              <li className="text-slate-700 hover:underline">Sign in</li>
            )}
            </Link>
        </ul>
      </div>
    </header>
  );
}
