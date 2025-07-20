import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import DropDown from "./DropDown";
import MenuBarContent from "./MenuBarContent";
import movieSearch from "../services/movies/movieSearch";
import searchTv from "../services/tvShows/searchTv";
import "./css/HorizontalCards.css";

const NavBar = ({
  currentUser,
  handleLogout,
  handleSetMovieId,
  genres,
  tvGenres,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedOption, setSelectedOption] = useState("movie");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        if (searchInput.trim() === "") {
          setSearchResult([]);
          return;
        }

        let response;

        if (selectedOption === "movie") {
          response = await movieSearch.searchMovies(searchInput);
        } else {
          response = await searchTv.searchTvShows(searchInput);
        }

        setSearchResult(response.results.slice(0, 10) || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchInput, selectedOption]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleUsernameClick = () => {
    setShowLogoutPopup(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const handleNavigateToWatchList = () => {
    if (currentUser) {
      navigate("/watchlist");
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setShowLoginPopup(false);
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleSearchResultsShow = () => {
    if (searchResult.length === 0) return;
    navigate("/search/results", {
      state: {
        movies: searchResult,
        type: selectedOption,
        genres: selectedOption === "movie" ? genres : tvGenres,
      },
    });
    setSearchInput("");
  };

  return (
    <>
      {/* Search Results */}
      <div
        className={`search-results cursor-pointer  absolute top-16 left-0 right-0 z-20 bg-white dark:text-white dark:bg-black rounded-md shadow-md md:w-2/3 w-11/12 h-[71%] md:h-[87%] mx-auto mt-11 md:mt-3 overflow-y-scroll scrollbar-custom ${
          searchInput.trim() === "" || searchResult.length === 0
            ? "hidden"
            : "block"
        }`}
      >
        {searchResult.length > 0 ? (
          searchResult.map((item) => {
            const title = selectedOption === "movie" ? item.title : item.name;
            const releasedDate =
              selectedOption === "movie"
                ? item.release_date
                : item.first_air_date;

            return (
              <div
                onClick={() => {
                  handleSetMovieId(item.id, selectedOption);
                  navigate(`/cardDetails/${searchResult.id}`);
                  setSearchResult([]);
                  setSearchInput("");
                }}
                key={item.id}
                className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w200/${item.poster_path}`
                        : "https://via.placeholder.com/100x150?text=No+Image"
                    }
                    alt={title || "No Title"}
                    className="md:w-[100px] md:h-[100px] w-12 h-16 object-cover mr-2"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {title || "Unknown Title"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {releasedDate || "Unknown Date"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="p-2 text-gray-500 dark:text-gray-400">
            No results found.
          </p>
        )}
      </div>

      {/* Navigation Bar */}
      <nav className="navbar  p-2 flex items-center justify-between border-gray-500 border-b-2 bg-white text-black dark:bg-customBlack dark:text-white">
        <div>
          <button
            onClick={toggleMenu}
            className="px-3 py-1"
            aria-label="Toggle Menu"
          >
            <i className="fa-solid fa-bars text-2xl"></i>
          </button>
        </div>

        {/* Home Button */}
        <div className="hidden lg:block">
          <button
            className="px-4 py-2 rounded-lg text-black hover:text-white hover:bg-gray-600 dark:text-white dark:hover:bg-gray-600"
            aria-label="Home"
            onClick={handleNavigateHome}
          >
            <i className="fa-solid fa-house"></i> Home
          </button>
        </div>

        {/* Dropdown for Large Screens */}
        <div className="hidden lg:block">
          <DropDown
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </div>

        {/* Search Bar */}
        <div className="searchBar flex flex-col md:flex-row w-full md:w-[50%]  space-y-2 md:space-y-0 md:space-x-2">
          <input
            type="text"
            value={searchInput}
            placeholder="Search for movies or TV shows"
            className="px-4 py-2 rounded-md w-full bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
            onChange={handleSearch}
            aria-label="Search Movies or TV Shows"
          />
          <div className="flex flex-row">
            <div className="block lg:hidden flex-1">
              <DropDown
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            </div>
            <button
              onClick={() => handleSearchResultsShow()}
              className="px-4 py-2 ml-2 bg-gray-600 text-white rounded-md flex-1"
              aria-label="Search Button"
            >
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>

        {/* Right-Side Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            className="px-4 py-2 rounded-lg text-black hover:bg-gray-600 hover:text-white dark:text-white dark:hover:bg-gray-600"
            aria-label="Watchlist"
            onClick={handleNavigateToWatchList}
          >
            <i className="fa-solid fa-bookmark"></i> Watchlist
          </button>
          {currentUser ? (
            <div className="relative">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-full dark:hover:bg-gray-600"
                aria-label="User Profile"
                onClick={handleUsernameClick} // Show the logout popup when clicked
              >
                {currentUser.username[0].toUpperCase()}
              </button>

              {/* Logout Confirmation Popup */}
              {showLogoutPopup && (
                <div className="absolute top-12 right-[-20px] bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-md shadow-lg p-4 z-30">
                  <p
                    className="cursor-pointer border-b-2 border-gray-300 pb-2  text-red-600 hover:text-red-800 dark:hover:text-red-400 font-semibold mb-2"
                    onClick={handleConfirmLogout}
                  >
                    Logout
                  </p>
                  <p
                    className="cursor-pointer text-gray-600  hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold"
                    onClick={handleCancelLogout}
                  >
                    Cancel
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button
              className="px-4 py-2 text-black rounded-lg hover:bg-gray-600 hover:text-white dark:text-white dark:hover:bg-gray-600"
              aria-label="Sign In"
              onClick={handleLoginClick}
            >
              <i className="fa-solid fa-user"></i> Login
            </button>
          )}
        </div>

        <div>
          <DarkModeToggle />
        </div>

        {/* Full-Screen Menu Overlay */}
        <MenuBarContent
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          currentUser={currentUser}
          handleLogout={handleLogout}
        />
      </nav>

      {showLoginPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-600 dark:text-white dark:bg-gray-900 dark:bg-opacity-50  bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900  p-6 rounded-md shadow-lg">
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

export default NavBar;
