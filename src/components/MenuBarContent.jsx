import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuBarContent = ({
  isMenuOpen,
  toggleMenu,
  currentUser,
  handleLogout,
}) => {
  const [showLogoutPopupMenu, setShowLogoutPopupMenu] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  const handleUsernameClickMenu = () => {
    setShowLogoutPopupMenu(true);
  };

  const handleConfirmLogoutMenu = () => {
    setShowLogoutPopupMenu(false);
    handleLogout();
  };

  const handleCancelLogoutMenu = () => {
    setShowLogoutPopupMenu(false);
  };

  const handleLoginClick = () => {
    toggleMenu();
    navigate("/login");
    setShowLoginPopup(false);
  };

  const handleHomeNavigate = () => {
    navigate("/");
    toggleMenu();
  };

  const handleWatchListNavigate = () => {
    if (!currentUser) {
      setShowLoginPopup(true);
    } else {
      toggleMenu();
      navigate("/watchlist");
    }
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  return (
    <>
      <div>
        <div
          className={`fixed inset-0 bg-white bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center z-40 text-black dark:bg-black dark:text-white pl-3 md:pl-0 transition-all duration-500 ease-in-out transform ${
            isMenuOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-2xl bg-black opacity-70 dark:bg-gray-800 text-white w-12 h-12 rounded-full flex items-center justify-center hover:opacity-90 transition"
          >
            <i className="fa-solid fa-x"></i>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-screen-xl h-full p-5 overflow-y-auto md:h-[85vh]">
            {/* Movies Section */}
            <div className="menu-section space-y-4">
              <h2 className="text-4xl font-semibold">Movies</h2>
              <ul className="space-y-2 cursor-pointer">
                <li
                  onClick={() => {
                    navigate("/trendingMoviesDay");
                    toggleMenu();
                  }}
                  className="text-2xl hover:text-blue-500"
                >
                  Trending Movies Day
                </li>
                <li
                  className="text-2xl hover:text-blue-500"
                  onClick={() => {
                    navigate("/trendingMoviesWeek");
                    toggleMenu();
                  }}
                >
                  Trending Movies Week
                </li>
                <li
                  className="text-2xl hover:text-blue-500"
                  onClick={() => {
                    navigate("/popularMovies");
                    toggleMenu();
                  }}
                >
                  Popular Movies
                </li>
                <li
                  className="text-2xl hover:text-blue-500"
                  onClick={() => {
                    navigate("/topRatedMovies");
                    toggleMenu();
                  }}
                >
                  Top Rated Movies
                </li>
                <li
                  className="text-2xl hover:text-blue-500"
                  onClick={() => {
                    navigate("/upcomingMovies");
                    toggleMenu();
                  }}
                >
                  Upcoming Movies
                </li>
                <li
                  className="text-2xl hover:text-blue-500"
                  onClick={() => {
                    navigate("/nowPlayingMovies");
                    toggleMenu();
                  }}
                >
                  Now Playing
                </li>
                <div>
                  <h2
                    className="text-4xl pt-5 hover:text-blue-500 cursor-pointer"
                    onClick={handleHomeNavigate}
                  >
                    <i className="fa-solid fa-house"></i> Home
                  </h2>
                </div>
                <div className="pt-7">
                  {currentUser ? (
                    <div className="relative">
                      <button
                        className="py-2 text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-500 text-4xl"
                        aria-label="User Profile"
                        onClick={handleUsernameClickMenu}
                      >
                        <i className="fa-solid fa-user"></i>
                        {"  "}
                        {currentUser.username.toUpperCase()}
                      </button>

                      {/* Logout Confirmation Popup */}
                      {showLogoutPopupMenu && (
                        <div className="absolute top-12 right-[180px] bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-md shadow-lg p-4 z-30">
                          <p
                            className="cursor-pointer border-b-2 border-gray-300 pb-2 text-red-400 hover:text-red-800 dark:hover:text-red-500 font-semibold mb-2"
                            onClick={handleConfirmLogoutMenu}
                          >
                            Logout
                          </p>
                          <p
                            className="cursor-pointer text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold"
                            onClick={handleCancelLogoutMenu}
                          >
                            Cancel
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      className="text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-500 text-4xl p-2"
                      aria-label="Sign In"
                      onClick={handleLoginClick}
                    >
                      <i className="fa-solid fa-user"></i> Login
                    </button>
                  )}
                </div>
              </ul>
            </div>

            {/* TV Shows Section */}
            <div className="menu-section space-y-4">
              <h2 className="text-4xl font-semibold">TV Shows</h2>
              <ul className="space-y-2 cursor-pointer ">
                <li
                  className="text-2xl hover:text-blue-500"
                  onClick={() => {
                    navigate("/trendingTvShowsDay");
                    toggleMenu();
                  }}
                >
                  Trending TV Shows Day
                </li>
                <li
                  className="text-2xl hover:text-blue-500"
                  onClick={() => {
                    navigate("/trendingTvShowsWeek");
                    toggleMenu();
                  }}
                >
                  Trending TV Shows Week
                </li>
                <li
                  className="text-2xl hover:text-blue-500"
                  onClick={() => {
                    navigate("/popularTvShows");
                    toggleMenu();
                  }}
                >
                  Popular TV Shows
                </li>
                <li
                  className="text-2xl hover:text-blue-500"
                  onClick={() => {
                    navigate("/topRatedTvShows");
                    toggleMenu();
                  }}
                >
                  Top Rated TV Shows
                </li>
                <li
                  className="text-2xl hover:text-blue-500"
                  onClick={() => {
                    navigate("/onAirTvShows");
                    toggleMenu();
                  }}
                >
                  On Air
                </li>

                <div onClick={handleWatchListNavigate} className="pt-10">
                  <li className="hover:text-blue-500 text-4xl transition">
                    <a href="#">
                      <i className="fa-solid fa-bookmark"></i> WatchList
                    </a>
                  </li>
                </div>
              </ul>
            </div>

            <div
              className="menu-section space-y-4
            "
            >
              <h1 className="text-4xl font-semibold">Persons</h1>
              <ul className="space-y-2 cursor-pointer">
                <li
                  className="text-2xl hover:text-blue-500"
                  onClick={() => {
                    navigate("/person/popular");
                    toggleMenu();
                  }}
                >
                  Popular Person
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {showLoginPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-600 dark:bg-gray-900 dark:bg-opacity-50 bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-lg">
            <p className="text-xl font-semibold mb-4">
              Please login to access the Watchlist
            </p>
            <button
              onClick={handleCloseLoginPopup}
              className="px-4 py-2 text-red-600 hover:bg-gray-300 rounded-md"
            >
              Close
            </button>
            <button
              onClick={handleLoginClick}
              className="ml-4 px-4 py-2 text-blue-600 hover:bg-gray-300 rounded-md"
            >
              login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuBarContent;
