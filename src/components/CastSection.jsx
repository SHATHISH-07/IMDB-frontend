import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CastSection = ({ cast, text, subtext, handleSetPersonId }) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleScroll = (direction) => {
    const scrollContainer = containerRef.current;
    const scrollAmount = scrollContainer.offsetWidth;
    scrollContainer.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSetPersonIdClick = (id) => {
    handleSetPersonId(id);
  };

  const hasCastData = cast && cast.length > 0;

  return (
    <div className="px-2 py-10 w-full text-black dark:text-white">
      {/* Title Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <i className="fa-solid fa-user-group mr-2"></i> {text}
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-lg">{subtext}</p>
        </div>
      </div>

      {/* If no cast data, show "No data available" */}
      {!hasCastData ? (
        <div className="text-center text-xl text-gray-500 dark:text-gray-300">
          No data available
        </div>
      ) : (
        // Card Container
        <div className="relative">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-scroll scroll-smooth snap-x snap-mandatory w-full scrollbar-hidden"
          >
            {cast.map((castMember) => (
              <div key={castMember.id} className="text-center group">
                <div
                  onClick={() => {
                    handleSetPersonIdClick(castMember.id);
                    navigate(`/person/${castMember.id}`);
                  }}
                  className="snap-center cursor-pointer flex-shrink-0 w-[250px] h-[250px] rounded-full shadow-xl overflow-hidden relative bg-gray-900 dark:bg-gray-800 transition-transform transform group-hover:scale-105 group-hover:shadow-2xl"
                >
                  {/* Profile Image or Default Icon */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundImage: castMember.profile_path
                        ? `url(https://image.tmdb.org/t/p/original${castMember.profile_path})`
                        : "url(https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png)",
                    }}
                  >
                    {!castMember.profile_path && (
                      <i className="fa-solid fa-user p-10 text-9xl text-white absolute inset-0 text-center flex items-center justify-center"></i>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                </div>

                {/* Name  */}
                <div className="mt-2">
                  <h3 className="text-lg font-bold text-black dark:text-white truncate">
                    {castMember.original_name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => handleScroll("prev")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 p-5 shadow-lg hover:bg-opacity-70 bg-opacity-50 transition-all rounded-md"
          >
            <i className="fa-solid fa-chevron-left text-2xl"></i>
          </button>
          <button
            onClick={() => handleScroll("next")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 p-5 shadow-lg bg-opacity-50 rounded-md hover:bg-opacity-70 transition-all"
          >
            <i className="fa-solid fa-chevron-right text-2xl"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default CastSection;
