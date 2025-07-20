import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import person from "../services/persons/person";
import "./css/HorizontalCards.css";

const AllPersonShow = ({
  title,
  subText,
  persons,
  handleSetPersonId,
  page,
  handleNextPage,
  handlePreviousPage,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const popupRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const fetchSearchResults = async () => {
      try {
        if (searchInput.trim() === "") {
          setSearchResult([]);
          return;
        }

        const response = await person.searchPersons(searchInput);

        if (!isCancelled) {
          setSearchResult(response.results.slice(0, 5) || []);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching search results:", error);
        }
      }
    };

    fetchSearchResults();

    return () => {
      isCancelled = true;
    };
  }, [searchInput]);

  const handleShowPopup = (person) => {
    setSelectedPerson(person);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPerson(null);
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="p-5 bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 dark:from-gray-900 dark:via-gray-700 dark:to-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold text-center mb-5">
        <i className="fa-solid fa-users"></i> {title}
      </h1>
      <p className="text-center text-wrap text-gray-700 dark:text-gray-400 mb-10">
        {subText}
      </p>

      <div className="flex justify-center">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearch}
          placeholder="Search for a person..."
          className="w-[500px]  p-3 mb-10 rounded-lg bg-gray-300 dark:bg-gray-800 border border-gray-700 dark:text-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        {searchResult.length > 0 && (
          <div className="absolute top-[400px] md:top-[280px] bg-gray-300 dark:bg-gray-900 w-[350px] h-[450px] md:w-[700px] md:h-[450px] shadow-lg rounded-lg z-10 overflow-y-scroll scrollbar-custom">
            {searchResult.map((result) => (
              <div
                key={result.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  handleSetPersonId(result.id);
                  setSearchInput("");
                  setSearchResult([]);
                  navigate(`/person/${result.id}`);
                }}
              >
                <img
                  src={
                    result.profile_path
                      ? `https://image.tmdb.org/t/p/original${result.profile_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image+Available"
                  }
                  className="w-[150px] h-[200px] rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {result.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {result.known_for_department || "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-10">
        {persons.map((person) => (
          <div
            key={person.id}
            className="flex flex-col cursor-pointer items-center"
            onClick={() => {
              handleSetPersonId(person.id);
              navigate(`/person/${person.id}`);
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
              alt={person.name}
              className="w-[300px] h-[300px] rounded-full object-cover transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            />
            <div className="text-center ">
              <h2 className="text-lg font-semibold">{person.name}</h2>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering parent click
                  handleShowPopup(person);
                }}
                className="text-gray-700 dark:text-gray-400 dark:hover:text-blue-500 hover:text-blue-500  mt-1"
              >
                <i className="fa-solid fa-info-circle text-lg"></i>
              </button>
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
          disabled={persons.length === 0}
          className={`px-4 py-2 rounded ${
            persons.length === 0
              ? "bg-black bg-opacity-50 text-white hover:bg-opacity-75 border-2 border-white rounded-xl cursor-not-allowed"
              : "bg-black bg-opacity-50 dark:hover:bg-opacity-30 text-white hover:bg-opacity-75 border-2 border-white rounded-xl"
          }`}
        >
          <i className="fa-solid fa-chevron-right p-5 text-3xl"></i>
        </button>
      </div>
      {/* Popup */}
      {showPopup && selectedPerson && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClosePopup}
        >
          <div
            ref={popupRef}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[90%] lg:w-[60%] relative flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
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
                  {selectedPerson.popularity?.toFixed(0) ||
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
                  {selectedPerson.known_for?.map((item) => (
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

export default AllPersonShow;
