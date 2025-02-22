import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/HorizontalCards.css";

const HorizontalCards = ({
  Movies,
  title = "Movies",
  subText,
  onWatchTrailer,
  genres,
  type,
  handleAddToWatchList,
  isLoggedIn,
  handleSetMovieId,
  navigator,
}) => {
  const containerRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const popupRef = useRef(null);
  const ignoreClick = useRef(false);

  const navigate = useNavigate();

  const getGenreNames = (genreIds) => {
    if (!genres.length) return "Fetching genres...";
    return genreIds
      .map((id) => {
        const foundGenre = genres.find((genre) => genre.id === id);
        return foundGenre ? foundGenre.name : "Unknown";
      })
      .join(", ");
  };

  const handleShowPopup = (movie) => {
    if (!movie) {
      console.error("Movie object is undefined or null.");
      return;
    }
    setSelectedMovie(movie);
    setShowPopup(true);
    ignoreClick.current = true;
    setTimeout(() => (ignoreClick.current = false), 100);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedMovie(null);
  };

  const handleClickOutside = (e) => {
    if (ignoreClick.current) {
      return;
    }
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      handleClosePopup();
    }
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (showPopup) {
        handleClickOutside(e);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }); // Only re-run when showPopup changes

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth;
      containerRef.current.scrollBy({
        left: direction === "forward" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleAddToWatchListWithLoginCheck = (movie, type) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    } else {
      handleAddToWatchList(movie, type);
    }
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setShowLoginPopup(false);
  };

  return (
    <div className="px-2 py-10 w-full text-black dark:text-white">
      {/* Title Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <i className="fa-solid fa-film text-gray-700 dark:text-gray-300"></i>{" "}
            {title}
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-lg">{subText}</p>
          <button
            onClick={() => navigate(`/${navigator}`)}
            className="block md:hidden bg-gray-800 text-white py-2 px-4 mt-3 rounded-lg hover:bg-gray-700 shadow-lg transition-all"
          >
            View All
          </button>
        </div>
        <button
          onClick={() => navigate(`/${navigator}`)}
          className="hidden md:block bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-700 shadow-lg transition-all"
        >
          View All
        </button>
      </div>

      {/* Card Container */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-scroll scroll-smooth snap-x snap-mandatory w-full scrollbar-hidden"
        >
          {Movies.map((movie) => (
            <div
              key={movie.id}
              className="snap-center flex-shrink-0 w-[250px] h-[400px] rounded-lg shadow-xl overflow-hidden relative group bg-gray-900 dark:bg-gray-800"
            >
              {/* Background Image */}
              <div
                className="absolute cursor-pointer inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                }}
              ></div>

              {/* Overlay */}
              <div
                onClick={() => {
                  handleSetMovieId(movie.id, type);
                  navigate(`/cardDetails/${movie.id}`);
                }}
                className="cursor-pointer absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent hover:from-black hover:via-transparent hover:to-transparent transition-all"
              ></div>

              {/* Bookmark Icon */}
              <div
                onClick={() => handleAddToWatchListWithLoginCheck(movie, type)}
                className="absolute  top-0 left-0 bg-transparent cursor-pointer rounded-full opacity-60 hover:opacity-100"
              >
                <i className="fa-solid fa-bookmark text-black text-[60px] border-x-4 border-gray-300"></i>
                <i className="fa-solid fa-plus absolute top-4 left-5 text-white text-lg"></i>
              </div>

              {/* Content */}
              <div className="absolute bottom-2 left-4 right-4 z-10">
                <h3 className="text-lg font-bold text-white truncate">
                  {type === "movie"
                    ? movie.original_title
                    : movie.original_name || "Unknown Title"}
                </h3>
                <p className="text-md text-white mt-1">
                  <i className="fa-solid fa-star text-yellow-400"></i>{" "}
                  {movie.vote_average.toFixed(1) || "N/A"}
                </p>

                {/* Info Button */}
                <button
                  onClick={() => handleShowPopup(movie)}
                  className="absolute top-7 hover:text-blue-400 right-2 text-white p-2 rounded-full transition-all shadow-lg"
                >
                  <i className="fa-solid fa-info-circle text-lg"></i>
                </button>

                {/* Watch Trailer Button */}
                <button
                  onClick={() => onWatchTrailer(movie, type)}
                  className="mt-4 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-all shadow-md w-full"
                >
                  <i className="fa-solid fa-play-circle mr-2"></i> Watch Trailer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => handleScroll("backward")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 p-5 shadow-lg hover:bg-opacity-70 bg-opacity-50 transition-all rounded-md"
        >
          <i className="fa-solid fa-chevron-left text-2xl"></i>
        </button>
        <button
          onClick={() => handleScroll("forward")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 p-5 shadow-lg bg-opacity-50 rounded-md hover:bg-opacity-70 transition-all"
        >
          <i className="fa-solid fa-chevron-right text-2xl"></i>
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={popupRef}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[80%] max-w-[800px] relative flex flex-col sm:flex-row"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the popup
          >
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              <i className="fa-solid fa-times text-2xl"></i>
            </button>

            {/* Poster on the left (on small screens, make it smaller) */}
            <div
              className="w-[150px] sm:w-[200px] h-[225px] sm:h-[300px] bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w500${
                  selectedMovie.poster_path || ""
                })`,
              }}
            ></div>

            {/* Movie Details on the right */}
            <div className="ml-0 sm:ml-6 flex flex-col justify-between w-full mt-4 sm:mt-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedMovie.original_title ||
                    selectedMovie.original_name ||
                    "Unknown Title"}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 mt-2">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    {selectedMovie.vote_average?.toFixed(1) || "N/A"}
                  </span>
                  <span>
                    {selectedMovie.release_date ||
                      selectedMovie.first_air_date ||
                      "N/A"}
                  </span>
                  <span>{getGenreNames(selectedMovie.genre_ids)}</span>
                </div>
                <div className="mt-4 h-[20vh] overflow-y-auto scrollbar-custom">
                  <p>{selectedMovie.overview || "No overview available."}</p>
                </div>
              </div>

              {/* Buttons at the bottom */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() =>
                    handleAddToWatchListWithLoginCheck(selectedMovie, type)
                  }
                  className="text-blue-600 bg-gray-200 py-2 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  <i className="fa-solid fa-plus mr-2"></i> Add to Watchlist
                </button>
                <button
                  onClick={() => onWatchTrailer(selectedMovie, type)}
                  className="hidden md:block text-gray-600 bg-gray-200 py-2 px-6 rounded-lg hover:bg-gray-300 transition-all"
                >
                  <i className="fa-solid fa-play-circle mr-2"></i> Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 dark:bg-opacity-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[80%] max-w-[400px] text-center">
            <p className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Please login to access the Watchlist
            </p>
            <div className="flex place-items-start mt-4 ml-5">
              <button
                onClick={handleCloseLoginPopup}
                className="text-red-500  px-4 mr-2 py-2 rounded-lg hover:bg-gray-300 transition-all"
              >
                Close
              </button>
              <button
                onClick={handleLoginClick}
                className="text-blue-500  px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalCards;
