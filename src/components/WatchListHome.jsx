import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const WatchListHome = ({
  title,
  subText,
  watchList,
  handleSetMovieId,
  currentUser,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const scrollContainer = (direction) => {
    const container = containerRef.current;
    const scrollAmount = direction === "left" ? -500 : 500;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-5 mx-5">
        <div className="mx-2">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100">
            <i className="fas fa-bookmark text-gray-700 dark:text-gray-300"></i>{" "}
            {title}
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-lg mt-2">
            {subText}
          </p>
          <button
            onClick={() => (!currentUser ? "" : navigate("/watchlist"))}
            className="block md:hidden bg-gray-800 text-white py-2 px-4 mt-3 rounded-lg hover:bg-gray-700 shadow-lg transition-all"
          >
            View All
          </button>
        </div>

        <button
          onClick={() => (!currentUser ? "" : navigate("/watchlist"))}
          className="hidden md:block bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-700 shadow-lg transition-all"
        >
          View All
        </button>
      </div>

      {/* If the user is not logged in */}
      {!currentUser ? (
        <div className="flex justify-center items-center p-10 mt-5">
          <div className="text-center   py-8 px-6 ">
            <p className="text-xl dark:text-gray-300 mb-4">
              Please sign in to view your watchlist.
            </p>
            <button
              onClick={() => {
                if (!currentUser) {
                  navigate("/login");
                }
              }}
              className="text-blue-600 py-2 px-6 rounded-lg hover:bg-gray-300 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      ) : (
        // Card Container
        <div className="relative mx-5 ">
          <button
            onClick={() => scrollContainer("left")}
            className="absolute z-20 left-0 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 p-5 shadow-lg hover:bg-opacity-70 bg-opacity-50 transition-all rounded-md"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory w-full scrollbar-hidden"
          >
            {watchList && watchList.length > 0 ? (
              watchList.map((movie) => (
                <div
                  key={movie.movieId}
                  className="snap-center my-4 flex-shrink-0 w-[250px] h-[400px] rounded-lg shadow-xl overflow-hidden relative group bg-gray-900 dark:bg-gray-800"
                >
                  <div
                    className="absolute cursor-pointer inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundImage: `url(${
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                          : "https://via.placeholder.com/500x750?text=No+Image"
                      })`,
                    }}
                  ></div>

                  {/* Overlay */}
                  <div
                    onClick={() => {
                      handleSetMovieId(movie.movieId, movie.mediaType);
                      navigate(`/cardDetails/${movie.movieId}`);
                    }}
                    className="cursor-pointer absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent hover:from-black hover:via-transparent hover:to-transparent transition-all"
                  ></div>

                  {/* Content */}
                  <div className="absolute bottom-2 left-4 right-4 z-10">
                    <h3 className="text-lg font-bold text-white truncate">
                      {movie.title || "Unknown Title"}
                    </h3>
                    <p className="text-md text-white mt-1">
                      <i className="fa-solid fa-star text-yellow-400"></i>{" "}
                      {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-700 dark:text-gray-400 text-lg mt-2">
                Your watchlist is empty.
              </p>
            )}
          </div>

          <button
            onClick={() => scrollContainer("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 p-5 shadow-lg hover:bg-opacity-70 bg-opacity-50 transition-all rounded-md"
          >
            <i className="fas fa-chevron-right text-2xl"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchListHome;
