import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import PropTypes from "prop-types";
import CastSection from "./CastSection";
import MediaCard from "./MediaCard";
import RecommendCard from "./RecommendCard";
import ClipLoader from "react-spinners/ClipLoader";
import "./css/HorizontalCards.css";

const IndividualCardDetails = ({
  handleSetPersonId,
  handleAddToWatchList,
  detailedShowCard,
  reviews,
  credits,
  images,
  videos,
  recommendations,
  genres,
  tvGenres,
  collections,
  type,
  currentUser,
  handleSetMovieId,
  onWatchTrailer,
}) => {
  const [trailer, setTrailer] = useState();
  const [directors, setDirectors] = useState([]);
  const [writers, setWriters] = useState([]);
  const [cast, setCast] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const handleVideoReady = () => {
    setIsVideoLoading(false);
  };

  function formatRuntime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  const handleScroll = (id, direction) => {
    const container = document.getElementById(id);
    const scrollAmount = direction === "next" ? 2000 : -1000; // Increased scroll amount
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    // Check if all necessary data is available to stop the loading state
    if (
      detailedShowCard &&
      videos &&
      credits &&
      genres &&
      images &&
      recommendations
    ) {
      setLoading(false); // Set loading to false when all data is loaded
    }
  }, [detailedShowCard, videos, credits, genres, images, recommendations]);

  useEffect(() => {
    const trailerData = videos?.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    setTrailer(trailerData);
  }, [videos]);

  useEffect(() => {
    if (credits.crew) {
      const directorsData = credits.crew.filter(
        (crew) =>
          crew.job === "Director" || crew.known_for_department === "Directing"
      );

      const uniqueDirectors = directorsData.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id)
      );
      setDirectors(uniqueDirectors);

      const writersData = credits.crew.filter(
        (crew) =>
          crew.job === "Writer" || crew.known_for_department === "Writing"
      );

      const uniqueWriters = writersData.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id)
      );
      setWriters(uniqueWriters);

      const castData = credits.cast;
      setCast(castData);
    }
  }, [credits]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openModal = (imagePath) => {
    setSelectedImage(imagePath);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleAddToWatchListWithLoginCheck = (movie, type) => {
    if (!currentUser) {
      setShowLoginPopup(true); // Show login popup if user is not logged in
    } else {
      handleAddToWatchList(movie, type); // Proceed with adding to watchlist if logged in
    }
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleOnWatchTrailer = (movie, type) => {
    onWatchTrailer(movie, type);
  };

  const handleSetMovieIdClick = (movieId, type) => {
    handleSetMovieId(movieId, type);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin border-4 border-t-4 border-blue-500 rounded-full w-16 h-16"></div>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 dark:from-gray-900 dark:via-gray-700 dark:to-gray-900"
      id="movieDetails"
    >
      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 dark:text-white p-5 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="mb-4">
              You need to log in to add items to your watchlist.
            </p>
            <div className="flex gap-4">
              <button
                onClick={closeLoginPopup}
                className="px-4 py-2 text-red-500 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  closeLoginPopup();
                  window.location.href = "/login";
                }}
                className="px-4 py-2 text-blue-500 rounded-md hover:bg-gray-300"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between dark:text-white p-3">
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl">
            {detailedShowCard.original_title || detailedShowCard.original_name}
          </h1>
          <div className="flex flex-wrap gap-x-5  text-sm md:text-lg">
            <p>
              {detailedShowCard.release_date || detailedShowCard.first_air_date}
            </p>
            <p>
              <i className="fa-regular fa-clock"></i>{" "}
              {formatRuntime(
                detailedShowCard.runtime ||
                  (Array.isArray(detailedShowCard.episode_run_time) &&
                    detailedShowCard.episode_run_time[0]) ||
                  0
              )}
            </p>
            <p>{detailedShowCard.status}</p>
          </div>
        </div>

        <div className="flex gap-x-5 md:gap-x-10 pt-5 lg:pt-2">
          <div>
            <p>RATING</p>
            <h2 className="text-xl md:text-2xl">
              <i className="fa-solid fa-star text-yellow-400"></i>{" "}
              {detailedShowCard.vote_average.toFixed(1)}/10
            </h2>
          </div>
          <div>
            <p>POPULARITY</p>
            <h2 className="text-xl md:text-2xl">
              <i className="fas fa-heart text-red-500"></i>{" "}
              {detailedShowCard.popularity.toFixed(1)}
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row px-3 h-auto lg:h-[65vh] gap-4 overflow-x-hidden">
        <div
          id="poster"
          style={{
            backgroundImage: `url(${
              detailedShowCard.backdrop_path
                ? `https://image.tmdb.org/t/p/original${detailedShowCard.backdrop_path}`
                : ""
            })`,
          }}
          className="w-full lg:w-[25%] h-60 lg:h-full bg-center bg-cover rounded-r-2xl rounded-bl-2xl relative max-w-full"
        >
          <div
            onClick={() =>
              handleAddToWatchListWithLoginCheck(detailedShowCard, type)
            }
            className="absolute top-0 left-0 bg-transparent cursor-pointer rounded-full opacity-80 hover:opacity-100"
          >
            <i className="fa-solid fa-bookmark text-black text-6xl lg:text-[60px] border-x-4 border-gray-300"></i>
            <i className="fa-solid fa-plus absolute top-3 lg:top-4 left-5 lg:left-5 text-white text-lg lg:text-lg"></i>
          </div>
        </div>

        {/* Video Section */}
        <div
          id="video"
          className="w-full lg:w-[60%] h-60 lg:h-full bg-black text-white rounded-2xl flex justify-center items-center relative max-w-full"
        >
          {isVideoLoading && (
            <div className="absolute flex justify-center items-center w-full h-full">
              <ClipLoader color="#ffffff" loading={isVideoLoading} size={50} />
            </div>
          )}
          {videos[0] && videos.length > 0 ? (
            <ReactPlayer
              url={`https://www.youtube-nocookie.com/embed/${videos[0]?.key}`}
              playing={true}
              controls={true}
              loop={true}
              pip={true}
              width="100%"
              height="100%"
              style={{ borderRadius: "1rem", overflow: "hidden" }}
              onReady={handleVideoReady}
            />
          ) : (
            <p className="text-center text-white">No trailer available</p>
          )}
        </div>

        {/* Image and Video Count */}
        <div className="w-full lg:w-[15%] h-40 lg:h-full flex lg:flex-col gap-2 lg:gap-1">
          <a href="#videoScroll" className="flex-1 scroll-smooth">
            <div
              id="video"
              className="flex flex-col justify-center items-center w-full h-full bg-black bg-opacity-70 text-white rounded-2xl"
            >
              <i className="fa-solid fa-play text-2xl lg:text-4xl p-2"></i>
              {videos.length} VIDEOS
            </div>
          </a>
          <a href="#imageScroll" className="flex-1 scroll-smooth">
            <div
              id="image"
              className="flex flex-col justify-center items-center w-full h-full bg-black bg-opacity-70 text-white rounded-2xl"
            >
              <i className="fa-solid fa-images text-2xl lg:text-4xl p-2"></i>
              {images.length} IMAGES
            </div>
          </a>
        </div>
      </div>

      {/* Modal for Full-Screen Image */}
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <img
            src={selectedImage.replace("/w500", "/original")}
            alt="Movie/TV Show"
            className="w-[80%] h-[80%] sm:object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex flex-wrap ml-5 mt-5 mb-20 dark:text-white gap-3">
        {detailedShowCard.genres.map((genre) => (
          <p
            key={genre.id}
            className="px-5 md:px-7 py-1 rounded-full border-2 border-black dark:border-gray-300 text-sm md:text-base"
          >
            {genre.name}
          </p>
        ))}
      </div>

      <div className="mt-4 ml-2 dark:text-white">
        <h3 className="text-4xl font-bold mb-2 flex items-center">
          <i className="fa-solid fa-film text-4xl mr-2"></i> Overview
        </h3>
        <p className="text-lg">Plot Summary of the show</p>
      </div>

      <MediaCard
        mediaDetails={detailedShowCard}
        collections={collections}
        handleAddToWatchListWithLoginCheck={handleAddToWatchListWithLoginCheck}
        currentUser={currentUser}
      />

      <CastSection
        cast={cast}
        text="Cast"
        subtext="The stars of the show"
        handleSetPersonId={handleSetPersonId}
      />

      <CastSection
        cast={directors}
        text="Directors"
        subtext="The storyteller behind the lens"
        handleSetPersonId={handleSetPersonId}
      />
      <CastSection
        cast={writers}
        text="Writers"
        subtext="The architect of the plot"
        handleSetPersonId={handleSetPersonId}
      />

      <div className="scroll-smooth dark:text-white">
        <div id="videoScroll">
          <h1 className="text-3xl  font-bold ml-2 mb-2 mt-10">
            {" "}
            <i className="fa-solid fa-video"></i> Videos
          </h1>
          <p className="text-lg mx-2">
            Videos of {detailedShowCard.title || detailedShowCard.name}
          </p>
          <div className="relative">
            <div
              className="flex overflow-x-auto scrollbar-hidden m-5 gap-5"
              id="video-scroll"
              style={{ height: "250px" }} // Increased height of the scroll container
            >
              {videos.map((video) => (
                <div
                  key={video.key}
                  className="flex-none w-[350px] h-[250px] bg-gray-800 rounded-lg overflow-hidden" // Increased width and height of video cards
                >
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${video.key}`}
                    playing={false}
                    controls={true}
                    width="100%"
                    height="100%"
                    style={{ borderRadius: "0.5rem" }}
                  />
                </div>
              ))}
            </div>
            {/* Navigation Buttons */}
            <button
              onClick={() => handleScroll("video-scroll", "prev")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 p-5 shadow-lg hover:bg-opacity-70 bg-opacity-50 transition-all rounded-md"
            >
              <i className="fa-solid fa-chevron-left text-2xl"></i>
            </button>
            <button
              onClick={() => handleScroll("video-scroll", "next")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 p-5 shadow-lg hover:bg-opacity-70 bg-opacity-50 transition-all rounded-md"
            >
              <i className="fa-solid fa-chevron-right text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Horizontal Scroll for Images */}
        <div id="imageScroll">
          <h1 className="text-3xl font-bold ml-2 mb-2 mt-20  ">
            <i className="fa-solid fa-images"></i> Images
          </h1>
          <p className="text-lg mx-2">
            Images of {detailedShowCard.title || detailedShowCard.name}
          </p>
          <div className="relative">
            <div
              className="flex overflow-x-auto scrollbar-hidden m-5 gap-5"
              id="image-scroll"
              style={{ height: "250px" }} // Increased height of the scroll container
            >
              {images.map((image) => (
                <div
                  key={image.file_path}
                  className="flex-none w-[300px] h-[250px] bg-gray-800 rounded-lg overflow-hidden cursor-pointer" // Increased width and height of image cards
                  onClick={() =>
                    openModal(
                      `https://image.tmdb.org/t/p/w500${image.file_path}`
                    )
                  }
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                    alt="Movie/TV Show"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            {/* Navigation Buttons */}
            <button
              onClick={() => handleScroll("image-scroll", "prev")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 p-5 shadow-lg hover:bg-opacity-70 bg-opacity-50 transition-all rounded-md"
            >
              <i className="fa-solid fa-chevron-left text-2xl"></i>
            </button>
            <button
              onClick={() => handleScroll("image-scroll", "next")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 p-5 shadow-lg hover:bg-opacity-70 bg-opacity-50 transition-all rounded-md"
            >
              <i className="fa-solid fa-chevron-right text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-20 ml-2">
          <i className="fa-solid fa-thumbs-up text-4xl "></i> Reviews
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-400 ml-2 mb-6">
          {reviews.length} Reviews
        </p>

        {reviews.map((review) => (
          <div
            className="flex flex-col md:flex-row m-6 p-6 rounded-lg dark:bg-gray-900 dark:bg-opacity-70 shadow-lg space-y-4 md:space-y-0 md:space-x-6 dark:text-white"
            key={review.id}
          >
            {/* Avatar and Author Info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-24 h-24 rounded-full border-4 border-yellow-500 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                  src={
                    review.author_details.avatar_path
                      ? `https://image.tmdb.org/t/p/w500${review.author_details.avatar_path}`
                      : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  }
                  alt={review.author}
                  className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                />
              </div>
              <h1 className="text-2xl mt-3 font-semibold">{review.author}</h1>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-star text-yellow-300"></i>
                <p className="text-xl font-semibold">
                  {review.author_details.rating}
                </p>
              </div>
            </div>

            {/* Review Content */}
            <div className="flex  flex-col md:flex-row md:items-center gap-5 w-full ">
              <div className="mt-3 md:mt-0 text-gray-800 dark:text-gray-300">
                {review.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      <RecommendCard
        movies={recommendations}
        title="Recommendations"
        subText={"Based on your preferences"}
        onWatchTrailer={handleOnWatchTrailer}
        genres={type === "movie" ? genres : tvGenres}
        type={type}
        handleSetMovieId={handleSetMovieIdClick}
      />
    </div>
  );
};

// PropTypes for validation
IndividualCardDetails.propTypes = {
  handleAddToWatchList: PropTypes.func.isRequired,
  detailedShowCard: PropTypes.object.isRequired,
  reviews: PropTypes.array.isRequired,
  credits: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired,
  videos: PropTypes.array.isRequired,
  recommendations: PropTypes.array.isRequired,
  genres: PropTypes.array.isRequired,
  tvGenres: PropTypes.array.isRequired,
};

export default IndividualCardDetails;
