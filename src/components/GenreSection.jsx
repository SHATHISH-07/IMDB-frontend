import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const GenreSection = ({ genres, title, subText, handleSetGenreId, type }) => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth;
      containerRef.current.scrollBy({
        left: direction === "forward" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleGenreIdSet = (genreId, type) => {
    handleSetGenreId(genreId, type);
  };

  return (
    <div className="px-2 py-10 w-full text-black dark:text-white">
      <div className="flex flex-col   mb-8">
        <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100">
          <i className="fas fa-film text-gray-700 dark:text-gray-300"></i>{" "}
          {title}
        </h1>
        <p className="text-gray-700 dark:text-gray-400 text-lg mt-2">
          {subText}
        </p>
      </div>

      {/* Horizontal Scrollable Genre Container */}
      <div className="relative ">
        <div
          className="flex gap-6 overflow-x-scroll  scroll-smooth snap-x snap-mandatory w-full scrollbar-hidden"
          ref={containerRef}
        >
          {genres.map((genre) => (
            <div
              key={genre.id}
              className="snap-center cursor-pointer flex-shrink-0 w-[180px] h-[180px] rounded-full bg-gradient-to-bl from-gray-900 via-blue-100 to-gray-900 flex items-center justify-center text-black text-xl font-medium  transform hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out"
              onClick={() => {
                handleGenreIdSet(genre.id, type);
                navigate(`/${type}/${genre.name}`);
              }}
            >
              {genre.name}
            </div>
          ))}
        </div>

        {/* Scroll Navigation Buttons */}
        <button
          onClick={() => handleScroll("backward")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white  border-2  p-5 shadow-lg hover:bg-opacity-70 bg-opacity-50 transition-all rounded-md"
        >
          <i className="fa-solid fa-chevron-left text-2xl"></i>
        </button>
        <button
          onClick={() => handleScroll("forward")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white border-2  p-5 shadow-lg bg-opacity-50 rounded-md hover:bg-opacity-70 transition-all"
        >
          <i className="fa-solid fa-chevron-right text-2xl"></i>
        </button>
      </div>
    </div>
  );
};

export default GenreSection;
