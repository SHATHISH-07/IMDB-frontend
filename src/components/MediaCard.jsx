import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

const MediaCard = ({
  mediaDetails,
  collections,
  handleAddToWatchListWithLoginCheck,
  currentUser,
}) => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const containerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (mediaDetails && collections) {
      setLoading(false);
    }
  }, [mediaDetails, collections]);

  useEffect(() => {
    if (collections.length > 0) {
      setLoadingCollection(false);
    }
  }, [collections]);

  const openYouTube = () => {
    const query = `${
      mediaDetails.original_title ||
      mediaDetails.name ||
      mediaDetails.belongs_to_collection?.name
    } trailer`;
    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        query
      )}`,
      "_blank"
    );
  };

  const handleAddToWatchlistClick = (movie, type) => {
    if (!currentUser) {
      setShowLoginPopup(true);
    } else {
      handleAddToWatchListWithLoginCheck(movie, type);
    }
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

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const getPosterUrl = (path) => {
    return path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : "https://via.placeholder.com/500x750?text=No+Image+Available";
  };

  if (loadingCollection || loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row mx-5 my-10 rounded-xl overflow-hidden shadow-lg dark:bg-gray-900 dark:bg-opacity-50 dark:text-white">
      {/* Poster Section */}
      {!mediaDetails.belongs_to_collection && !mediaDetails.seasons?.length && (
        <div className="w-full md:w-1/4">
          <img
            src={getPosterUrl(mediaDetails.poster_path)}
            alt={mediaDetails.name || mediaDetails.belongs_to_collection?.name}
            className="w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 flex flex-col justify-between w-full">
        {/* Title and Rating Section */}
        <div>
          <h2 className="text-3xl font-bold">
            {mediaDetails.title ||
              mediaDetails.name ||
              mediaDetails.belongs_to_collection?.title}
          </h2>
          <p className="text-lg">
            <i className="fa-solid fa-star text-yellow-300"></i>{" "}
            {mediaDetails.vote_average?.toFixed(1) || "N/A"}
          </p>
        </div>

        {/* Seasons or Collection Section */}
        <div className="mt-4 relative">
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {mediaDetails.seasons?.length > 0 ? (
                <>
                  <p className="mb-3">{mediaDetails.overview}</p>
                  <h3 className="text-xl font-semibold mb-2">Seasons</h3>
                  <div
                    ref={containerRef}
                    className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-hidden sm:py-4 sm:px-2"
                  >
                    {mediaDetails.seasons.map((season) => (
                      <div
                        key={season.id}
                        className="min-w-[300px] p-4 rounded-lg bg-gray-200 dark:bg-gray-900 shadow-lg transform hover:scale-105 transition-transform duration-300 sm:min-w-[250px] sm:p-3"
                      >
                        <img
                          src={getPosterUrl(season.poster_path)}
                          alt={season.name}
                          className="w-full h-56 object-cover rounded-lg"
                        />
                        <p className="mt-3 text-base font-semibold">
                          {season.name}
                        </p>
                        <p className="text-sm">
                          Episodes: {season.episode_count}
                        </p>
                        <p className="text-sm">
                          <i className="fa-solid fa-star text-yellow-300"></i>{" "}
                          {season.vote_average?.toFixed(1) || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleScroll("forward")}
                    className="absolute right-0 top-2/4 transform -translate-y-1/2 bg-black text-white border-2 p-2 shadow-lg bg-opacity-50 rounded-md hover:bg-opacity-70 transition-all sm:p-1"
                  >
                    <i className="fa-solid fa-chevron-right text-2xl"></i>
                  </button>
                </>
              ) : mediaDetails.belongs_to_collection &&
                collections.length > 0 ? (
                <>
                  <p className="mb-3">{mediaDetails.overview}</p>
                  <h3 className="text-xl font-semibold mb-2">
                    Belongs to Collection
                  </h3>
                  <div
                    ref={containerRef}
                    className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-hidden sm:py-4 sm:px-2"
                  >
                    {collections.map((collection) => (
                      <div
                        key={collection.id}
                        className="min-w-[300px] p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 sm:min-w-[250px] sm:p-3"
                      >
                        <img
                          src={getPosterUrl(collection.poster_path)}
                          alt={collection.title}
                          className="w-full h-56 object-cover rounded-lg"
                        />
                        <p className="mt-3 text-base font-semibold">
                          {collection.title}
                        </p>
                        <p className="text-sm">
                          Released: {collection.release_date}
                        </p>
                        <p className="text-sm">
                          <i className="fa-solid fa-star text-yellow-300"></i>{" "}
                          {collection.vote_average?.toFixed(1) || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleScroll("forward")}
                    className="absolute right-0 top-2/4 transform -translate-y-1/2 bg-black text-white border-2 p-2 shadow-lg bg-opacity-50 rounded-md hover:bg-opacity-70 transition-all sm:p-1"
                  >
                    <i className="fa-solid fa-chevron-right text-2xl"></i>
                  </button>
                </>
              ) : (
                <div className="text-center text-2xl">
                  {mediaDetails.overview || "No overview available"}
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={() => handleAddToWatchlistClick(mediaDetails, "movie")}
            className="text-blue-600 hover:text-blue-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transform hover:scale-105 transition-all"
          >
            <i className="fa-solid fa-plus-circle text-xl"></i> Add to Watchlist
          </button>
          <button
            onClick={openYouTube}
            className="text-red-600 hover:text-red-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transform hover:scale-105 transition-all"
          >
            <i className="fa-solid fa-play-circle text-xl"></i> Watch Trailer
          </button>
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transform hover:scale-105 transition-all"
          >
            <i className="fa-solid fa-home text-xl"></i> Home
          </Link>
        </div>

        {showLoginPopup && (
          <div className="fixed inset-0 bg-gray-600 dark:bg-black dark:bg-opacity-70 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[80%] max-w-[400px] text-center">
              <p className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Please login to access the Watchlist
              </p>
              <div className="flex  mt-4">
                <button
                  onClick={handleCloseLoginPopup}
                  className="text-red-500 px-4 mr-2 py-2 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={handleLoginClick}
                  className="text-blue-600 dark:hover:bg-gray-300 rounded-lg px-4 py-2 "
                >
                  Login!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCard;
