import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./css/HorizontalCards.css";

const HeroSection = ({
  movie,
  genres,
  onWatchTrailer,
  handleAddToWatchList,
  isLoggedIn,
}) => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

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

  const getGenreNames = (genreIds) => {
    if (!genres.length) return "Fetching genres...";
    return genreIds
      .map((id) => {
        const foundGenre = genres.find((genre) => genre.id === id);
        return foundGenre ? foundGenre.name : "Unknown";
      })
      .join(", ");
  };

  return (
    <div>
      <div className="mx-auto py-4">
        {movie ? (
          <div className="flex flex-col md:flex-row gap-6">
            <div
              className="h-[80vh] md:h-[85vh] w-full lg:w-[70%] bg-cover flex items-end rounded-lg border border-black relative overflow-hidden"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                backgroundPosition: "center top",
              }}
            >
              {/* Overlay to darken background for text readability */}
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10 h-[4rem] flex items-center justify-center text-white bg-black bg-opacity-50 text-xl w-full text-center p-2 rounded-b-lg">
                {movie.original_title || "Unknown Title"}
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg w-full hidden lg:block md:w-[30%] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
                Catching on
              </h2>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                {movie.original_title || "Unknown Title"}
              </h3>
              <p
                className="text-sm dark:text-gray-400 p-2 h-40 overflow-x-hidden mb-4"
                id="overview"
              >
                {movie.overview || "Description not available."}
              </p>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                <strong>Release Date:</strong> {movie.release_date || "N/A"}
              </p>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                <strong>Genres:</strong> {getGenreNames(movie.genre_ids)}
              </p>
              <div className="flex items-center mb-4">
                <i className="fa-solid fa-star text-xl text-yellow-400 mr-2"></i>
                <span className="text-lg font-semibold">
                  {movie.vote_average.toFixed(1) || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <button
                  onClick={() =>
                    handleAddToWatchListWithLoginCheck(movie, "movie")
                  }
                  className="px-4 py-2 text-blue-500 rounded-lg hover:text-blue-600 bg-gray-300 transition transform hover:scale-105 shadow-md"
                >
                  <i className="fa-solid fa-bookmark text-lg"></i> Add to
                  Watchlist
                </button>
                <button
                  className="px-4 py-2 text-red-500 rounded-lg hover:text-red-600 bg-gray-300  transition transform hover:scale-105 shadow-md"
                  onClick={() => onWatchTrailer(movie, "movie")}
                >
                  <i className="fa-solid fa-play-circle text-xl"></i> Watch
                  Trailer
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[80vh]">
            <div className="text-gray-500 dark:text-gray-300 text-lg">
              No movie data available.
            </div>
          </div>
        )}
      </div>
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

HeroSection.propTypes = {
  movie: PropTypes.object,
  genres: PropTypes.array.isRequired,
  onWatchTrailer: PropTypes.func.isRequired,
  handleAddToWatchList: PropTypes.func.isRequired,
};

export default HeroSection;
