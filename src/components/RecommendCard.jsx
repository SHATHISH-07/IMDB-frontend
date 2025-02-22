import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/HorizontalCards.css";

const RecommendCard = ({
  movies,
  title,
  subText,
  onWatchTrailer,
  genres,
  type,
  handleSetMovieId,
}) => {
  const containerRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieData, setMovieData] = useState([]);
  const [storedType, setStoredType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (movies && movies.length > 0) {
      setMovieData(movies);
      localStorage.setItem("movies", JSON.stringify(movies));
    }
  }, [movies]);

  useEffect(() => {
    if (type) {
      setStoredType(type);
      localStorage.setItem("type", type);
    }
  }, [type]);

  useEffect(() => {
    const storedMovies = localStorage.getItem("movies");
    const storedType = localStorage.getItem("type");

    if (storedMovies) {
      setMovieData(JSON.parse(storedMovies));
    }

    if (storedType) {
      setStoredType(storedType);
    }
  }, []);

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
    setSelectedMovie(movie);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedMovie(null);
  };

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth;
      containerRef.current.scrollBy({
        left: direction === "forward" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSetMovieIdClick = (movieId) => {
    handleSetMovieId(movieId, storedType);
  };

  const handleWatchTrailerClick = (movie) => {
    onWatchTrailer(movie, storedType);
  };

  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-20 ml-2">
        <i className="fa-solid fa-lightbulb"></i> {title}
      </h2>
      <p className="text-lg text-gray-700 dark:text-gray-400 ml-2 ">
        {subText}
      </p>

      <div className="relative ">
        <div
          ref={containerRef}
          className="flex gap-6  overflow-x-scroll scroll-smooth snap-x snap-mandatory w-full scrollbar-hidden"
        >
          {/* Conditional rendering to ensure movie is an array */}
          {movieData && movieData.length > 0 ? (
            movieData.map((movie) => (
              <div
                key={movie.id}
                className="snap-center m-5 flex-shrink-0 w-[250px] h-[400px] rounded-lg shadow-xl overflow-hidden relative group bg-gray-900 dark:bg-gray-800"
              >
                <div
                  className="absolute cursor-pointer inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                  }}
                ></div>

                <div
                  onClick={() => {
                    handleSetMovieIdClick(movie.id);
                    navigate(`/cardDetails/${movie.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="cursor-pointer absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent hover:from-black hover:via-transparent hover:to-transparent transition-all"
                ></div>

                <div className="absolute bottom-2 left-4 right-4 z-10">
                  <h3 className="text-lg font-bold text-white truncate max-w-full">
                    {movie.original_title || movie.original_name}
                  </h3>
                  <p className="text-md text-white mt-1">
                    <i className="fa-solid fa-star text-yellow-400"></i>{" "}
                    {movie.vote_average.toFixed(1) || "N/A"}
                  </p>

                  <button
                    onClick={() => handleShowPopup(movie)}
                    className="absolute top-7 hover:text-blue-400 right-2 text-white p-2 rounded-full transition-all shadow-lg"
                  >
                    <i className="fa-solid fa-info-circle text-lg"></i>
                  </button>

                  <button
                    onClick={() => handleWatchTrailerClick(movie)}
                    className="mt-4 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-all shadow-md w-full"
                  >
                    <i className="fa-solid fa-play-circle mr-2"></i> Watch
                    Trailer
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No movies available.</p>
          )}
        </div>

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
      {showPopup && selectedMovie && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[80%] max-w-[800px] relative flex flex-col sm:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              <i className="fa-solid fa-times text-2xl"></i>
            </button>

            <div
              className="w-[150px] sm:w-[200px] h-[225px] sm:h-[300px] bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w500${
                  selectedMovie.poster_path || ""
                })`,
              }}
            ></div>

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
                <div className="mt-4 dark:text-white h-[20vh] overflow-y-auto scrollbar-custom">
                  <p>{selectedMovie.overview || "No overview available."}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => handleWatchTrailerClick(selectedMovie)}
                  className="text-red-500 rounded-lg bg-gray-300 p-2"
                >
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendCard;
