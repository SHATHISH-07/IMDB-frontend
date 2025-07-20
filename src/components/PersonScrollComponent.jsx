import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const PersonsScrollComponent = ({ people, handleSetPersonId }) => {
  const containerRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const popupRef = useRef(null);
  const ignoreClick = useRef(false);

  const navigate = useNavigate();

  const handleShowPopup = (person) => {
    setSelectedPerson(person);
    setShowPopup(true);
    ignoreClick.current = true;
    setTimeout(() => (ignoreClick.current = false), 100);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPerson(null);
  };

  const handleClickOutside = (e) => {
    if (ignoreClick.current) return;
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      handleClosePopup();
    }
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (showPopup) handleClickOutside(e);
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  });

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth;
      containerRef.current.scrollBy({
        left: direction === "forward" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="px-2 py-10 w-full text-black dark:text-white">
      {/* Title Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <i className="fa-solid fa-star text-gray-700 dark:text-gray-300"></i>{" "}
            Popular People
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-lg">
            {" "}
            Discover profiles of trending individuals.
          </p>
          <button
            onClick={() => navigate("/person/popular")}
            className="block md:hidden bg-gray-800 text-white py-2 px-6 mt-3 rounded-lg hover:bg-gray-700 shadow-lg transition-all"
          >
            View All
          </button>
        </div>
        <button
          onClick={() => navigate("/person/popular")}
          className="hidden md:block bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-700 shadow-lg transition-all"
        >
          View All
        </button>
      </div>

      {/* Card Container */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-6 cursor-pointer overflow-x-scroll scroll-smooth snap-x snap-mandatory w-full scrollbar-hidden"
        >
          {people.map((person) => (
            <div key={person.id} className="text-center group">
              <div className="snap-center flex-shrink-0 w-[250px] h-[250px] rounded-full shadow-xl overflow-hidden relative bg-gray-900 dark:bg-gray-800 transition-transform transform group-hover:scale-105 group-hover:shadow-2xl">
                {/* Profile Image with Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${person.profile_path})`,
                  }}
                ></div>
                <div
                  onClick={() => {
                    handleSetPersonId(person.id);
                    navigate(`/person/${person.id}`);
                  }}
                  className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"
                ></div>
              </div>

              {/* Name and Info Button */}
              <div className="mt-2">
                <h3 className="text-lg font-bold text-black dark:text-white truncate">
                  {person.name}
                </h3>
                <button
                  onClick={() => handleShowPopup(person)}
                  className="text-gray-700 dark:text-gray-400 group-hover:text-blue-500 transition-all mt-1"
                >
                  <i className="fa-solid fa-info-circle text-lg"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
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

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={popupRef}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[90%] max-w-[800px] relative flex flex-col sm:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              <i className="fa-solid fa-times text-2xl"></i>
            </button>

            {/* Profile Image */}
            <div
              className="w-[150px] sm:w-[300px] h-[225px] sm:h-[400px] bg-cover bg-center rounded-lg shadow-lg"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w500${
                  selectedPerson.profile_path || ""
                })`,
              }}
            ></div>

            {/* Person Details */}
            <div className="ml-0 sm:ml-6 flex flex-col justify-between w-full mt-4 sm:mt-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedPerson.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Known For: {selectedPerson.known_for_department || "Unknown"}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  <i className="fa-solid fa-star text-yellow-500 mr-2"></i>
                  {selectedPerson.popularity.toFixed(0) ||
                    "No popularity available."}
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  <i className="fa-solid fa-venus-mars text-blue-500 mr-2"></i>
                  {selectedPerson.gender === 1 ? "Female" : "Male"}
                </p>
              </div>

              {/* Known For Section */}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Known For:
                </h3>
                <div className="flex gap-4 overflow-x-auto">
                  {selectedPerson.known_for.map((item) => (
                    <div
                      key={item.id}
                      className="w-[150px] h-[225px] bg-cover bg-center rounded-lg shadow-lg flex-shrink-0"
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/w500${
                          item.poster_path || ""
                        })`,
                      }}
                    >
                      <div className="bg-black bg-opacity-60 text-white p-2 rounded-b-lg">
                        <p className="text-sm text-center">
                          {item.original_title || item.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

PersonsScrollComponent.propTypes = {
  people: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      profile_path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      biography: PropTypes.string,
    })
  ).isRequired,
};

export default PersonsScrollComponent;
