import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AllCardShow = ({
  title,
  subText,
  movies,
  handleSetMovieId,
  handleAddToWatchList,
  page,
  handleNextPage,
  handlePreviousPage,
  currentUser,
  genres,
  type,
}) => {
  const [randomMovie, setRandomMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navigate = useNavigate();

  // Random movie logic
  useEffect(() => {
    if (movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setRandomMovie(movies[randomIndex]);

      const interval = setInterval(() => {
        const newRandomIndex = Math.floor(Math.random() * movies.length);
        setRandomMovie(movies[newRandomIndex]);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [movies]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
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

  const handleWatchTrailer = (movie, type) => {
    if (movie) {
      const titleOrName =
        type === "movie" ? movie.original_title : movie.original_name;
      window.open(
        `https://www.youtube.com/results?search_query=${titleOrName} trailer`,
        "_blank"
      );
    }
  };

  const handleAddToWatchlistClick = (movie) => {
    if (!currentUser) {
      openLoginModal();
    } else {
      handleAddToWatchList(movie, type);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 dark:from-gray-900 dark:via-gray-700 dark:to-gray-900">
      {/* Random Movie Section */}
      <div className="h-[80vh] sm:h-[77vh] relative bg-cover bg-center flex justify-center items-center overflow-hidden">
        {randomMovie && (
          <img
            src={`https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}`}
            alt={randomMovie.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 text-lg sm:text-xl text-white text-center">
          {randomMovie?.original_title || randomMovie?.original_name}
        </div>
      </div>

      {/* Title Section */}
      <div className="m-3 flex flex-col justify-center items-center text-center dark:text-white">
        <h1 className="text-2xl sm:text-4xl font-bold">
          <i className="fa-solid fa-film mr-2"></i>
          {title}
        </h1>
        <p className="text-gray-700 dark:text-gray-400 text-base sm:text-lg">
          {subText}
        </p>
      </div>

      {/* Movies Grid */}
      <div className="flex flex-wrap justify-center sm:justify-between gap-5 m-5">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="w-[80%] sm:w-[250px] h-[50vh] md:h-[55vh] relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Bookmark Icon */}
            <div
              onClick={() => handleAddToWatchlistClick(movie)}
              className="absolute z-20  top-0 left-0 bg-transparent cursor-pointer rounded-full opacity-60 hover:opacity-100"
            >
              <i className="fa-solid fa-bookmark text-black text-[60px] border-x-4 border-gray-300"></i>
              <i className="fa-solid fa-plus absolute top-4 left-5 text-white text-lg"></i>
            </div>
            <div
              onClick={() => {
                handleSetMovieId(movie.id, type);
                navigate(`/cardDetails/${movie.id}`);
              }}
              className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-0 cursor-pointer"
            ></div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    {movie.title || movie.name}
                  </h3>
                  <p className="text-base sm:text-lg">
                    <i className="fa-solid fa-star text-yellow-500"></i>{" "}
                    {movie.vote_average.toFixed(1)}
                  </p>
                </div>
                <button
                  onClick={() => openModal(movie)}
                  className="px-2 sm:px-4 py-1 sm:py-2 hover:text-blue-500 text-white rounded"
                >
                  <i className="fa-solid fa-circle-info"></i>
                </button>
              </div>
              <div className="w-full mt-2">
                <button
                  onClick={() => handleWatchTrailer(movie, type)}
                  className="w-full px-2 sm:px-4 py-1 sm:py-2 bg-gray-600 text-white rounded hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-900"
                >
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center p-5">
        {/* Previous Page Button */}
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-black bg-opacity-50 text-white hover:bg-opacity-75 border-2 border-white rounded-xl cursor-not-allowed"
              : "bg-black bg-opacity-50 text-white hover:bg-opacity-75 dark:hover:bg-opacity-30  border-2 border-white rounded-xl"
          }`}
        >
          <i className="fa-solid fa-chevron-left p-5 text-3xl"></i>
        </button>

        {/* Current Page Display */}
        <span className="w-[70px] h-[50px] flex items-center justify-center bg-black  text-white bg-opacity-75 border-2 border-gray-500 dark:border-white rounded-xl text-xl">
          {page}
        </span>

        {/* Next Page Button */}
        <button
          onClick={handleNextPage}
          disabled={movies.length === 0}
          className={`px-4 py-2 rounded ${
            movies.length === 0
              ? "bg-black bg-opacity-50 text-white hover:bg-opacity-75 border-2 border-white rounded-xl cursor-not-allowed"
              : "bg-black bg-opacity-50 dark:hover:bg-opacity-30 text-white hover:bg-opacity-75 border-2 border-white rounded-xl"
          }`}
        >
          <i className="fa-solid fa-chevron-right p-5 text-3xl"></i>
        </button>
      </div>

      {/* Modal for Movie Details */}
      {isModalOpen && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 dark:text-white p-4 sm:p-6 rounded-lg w-[90%] lg:w-[60%] flex flex-col sm:flex-row">
            <img
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
              className="w-full sm:w-[300px] h-[300px] object-cover mb-4 sm:mb-0 sm:mr-6"
            />
            <div className="flex flex-col justify-between">
              <h2 className="text-xl sm:text-2xl font-bold">
                {selectedMovie.title || selectedMovie.name}
              </h2>
              <div className="flex gap-4">
                <p className="text-base sm:text-lg">
                  <i className="fa-solid fa-star text-yellow-300"></i>{" "}
                  {selectedMovie.vote_average.toFixed(1)}
                </p>
                <p className="text-base sm:text-lg">
                  {selectedMovie.release_date}
                </p>
              </div>
              <p className="text-base sm:text-lg">
                Genres: {getGenreNames(selectedMovie.genre_ids)}
              </p>
              <p className="text-base sm:text-lg mt-2">
                {selectedMovie.overview}
              </p>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleAddToWatchlistClick(selectedMovie)}
                  className="px-4 py-2 text-blue-600 hover:bg-gray-300 dark:hover:bg-gray-400 bg-gray-200 rounded"
                >
                  Add to Watchlist
                </button>
                <button
                  onClick={() => handleWatchTrailer(selectedMovie, type)}
                  className="px-4 py-2 text-gray-900 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-400 rounded"
                >
                  Watch Trailer
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-red-500 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-400 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:text-white dark:bg-gray-900 p-4 sm:p-6 rounded-lg flex flex-col ">
            <h2 className="text-xl sm:text-2xl mb-4">
              Please log in to add to your watchlist
            </h2>
            <div>
              <button
                onClick={closeLoginModal}
                className="px-4 py-2 text-red-500  hover:bg-gray-300 dark:hover:bg-gray-400 rounded mr-4"
              >
                Close
              </button>
              <button
                onClick={() => navigate("/login", { replace: true })}
                className="px-4 py-2  hover:bg-gray-300 dark:hover:bg-gray-400 text-blue-600 rounded"
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

export default AllCardShow;
