import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WatchList = ({ watchlist, onRemove, handleSetMovieId }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const filteredWatchlist = useMemo(
    () =>
      watchlist.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, watchlist]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Search Bar */}
      <div className="flex flex-col justify-center items-center p-4">
        <div className="text-3xl font-bold m-5">
          <i className="fa-solid fa-film"></i> WatchList
        </div>
        <div>
          <input
            type="text"
            placeholder="Search in watchlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 sm:w-96 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search watchlist"
          />
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="overflow-x-auto mt-8">
        {/* Desktop Layout */}
        <table className="min-w-full bg-white dark:bg-gray-800 border hidden custom-sm:table">
          <thead>
            <tr>
              <th
                className="py-2 px-20 text-left font-semibold text-gray-900 dark:text-white"
                scope="col"
              >
                Title
              </th>
              <th
                className="py-2 px-4 text-left font-semibold text-gray-900 dark:text-white"
                scope="col"
              >
                Type
              </th>
              <th
                className="py-2 px-4 text-left font-semibold text-gray-900 dark:text-white"
                scope="col"
              >
                Rating
              </th>
              <th
                className="py-2 px-4 text-left font-semibold text-gray-900 dark:text-white"
                scope="col"
              >
                Release Date
              </th>
              <th
                className="py-2 px-4 text-left font-semibold text-gray-900 dark:text-white"
                scope="col"
              >
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredWatchlist.length > 0 ? (
              filteredWatchlist.map((movie) => (
                <tr
                  key={movie.movieId}
                  className="border-t dark:border-gray-700"
                >
                  <td className="py-2 px-5">
                    <img
                      onClick={() => {
                        handleSetMovieId(movie.movieId, movie.mediaType);
                        navigate(`/cardDetails/${movie.movieId}`);
                      }}
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                          : "https://via.placeholder.com/200x300?text=No+Image"
                      }
                      alt={movie.title}
                      className="w-40 h-48 rounded-lg cursor-pointer"
                    />
                    <p className="w-40">{movie.title}</p>
                  </td>
                  <td className="py-2 px-5">
                    {movie.mediaType === "movie" ? "Movie" : "TV Show"}
                  </td>
                  <td className="py-2 px-5">
                    {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                  </td>
                  <td className="py-2 px-5">{movie.releasedAt || "Unknown"}</td>
                  <td className="py-2 pl-10">
                    <button
                      onClick={() => onRemove(movie.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600"
                      aria-label={`Remove ${movie.title}`}
                    >
                      <i className="fas fa-trash-can text-xl"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-2 px-4 text-center text-gray-500 dark:text-gray-400"
                >
                  Your watchlist is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile Layout */}
        <table className="bg-white block custom-sm:hidden dark:bg-gray-800 border">
          <thead>
            <tr>
              <th className="py-2 px-10 text-left font-semibold text-gray-900 dark:text-white">
                Title
              </th>
              <th className="py-2 px-10 text-left font-semibold text-gray-900 dark:text-white">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredWatchlist.length > 0 ? (
              filteredWatchlist.map((movie) => (
                <tr
                  key={movie.movieId}
                  className="border-t dark:border-gray-700"
                >
                  <td className="py-2 px-5 flex items-center">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                          : "https://via.placeholder.com/200x300?text=No+Image"
                      }
                      alt={movie.title}
                      className="w-20 h-28 rounded-lg mr-4"
                    />
                    <div>
                      <p className="font-bold">{movie.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="py-2 px-10 text-right">
                    <button
                      onClick={() => onRemove(movie.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600"
                      aria-label={`Remove ${movie.title}`}
                    >
                      <i className="fas fa-trash-can text-xl"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="py-2 px-4 text-center text-gray-500 dark:text-gray-400"
                >
                  Your watchlist is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WatchList;
