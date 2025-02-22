import { useState, useEffect } from "react";
import "./css/HorizontalCards.css";

const IndividualPerson = ({ personDetails }) => {
  const [storedPersonDetails, setStoredPersonDetails] = useState(null);

  // Sync state with props and save to localStorage
  useEffect(() => {
    if (personDetails) {
      setStoredPersonDetails(personDetails);
      localStorage.setItem(
        "storedPersonDetails",
        JSON.stringify(personDetails)
      );
    }
  }, [personDetails]);

  // Fetch data from localStorage on initial mount if no props are provided
  useEffect(() => {
    if (!personDetails) {
      const fetchedPersonDetails = JSON.parse(
        localStorage.getItem("storedPersonDetails")
      );
      if (fetchedPersonDetails) {
        setStoredPersonDetails(fetchedPersonDetails);
      }
    }
  }, [personDetails]);

  useEffect(() => {
    window.scrollBy(0, 0);
  }, []);

  // Render loading if data is not available
  if (!storedPersonDetails) {
    return <div>Loading...</div>;
  }

  const getIcon = (department) => {
    switch (department) {
      case "Acting":
        return (
          <i className="fa-solid fa-film bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text mr-2"></i>
        );
      case "Directing":
        return (
          <i className="fa-solid fa-video bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mr-2"></i>
        );
      case "Camera":
        return (
          <i className="fa-solid fa-camera bg-gradient-to-r from-green-500 to-teal-500 text-transparent bg-clip-text mr-2"></i>
        );
      default:
        return (
          <i className="fa-solid fa-pencil bg-gradient-to-r from-gray-500 to-gray-800 text-transparent bg-clip-text mr-2"></i>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white">
      <div
        key={storedPersonDetails.id}
        className="flex flex-wrap justify-between "
      >
        <div className="mx-9 my-2 w-full sm:w-auto">
          <h1 className="text-4xl mb-2">{storedPersonDetails.name}</h1>
          <h2 className="text-2xl">
            <i className="fa-solid fa-venus-mars text-blue-500"></i>
            {storedPersonDetails.gender === 1 ? "Female" : "Male"}
          </h2>
        </div>
        <div className="flex text-sm sm:text-xl md:text-2xl justify-center items-center w-full sm:w-auto mt-4 sm:mt-0">
          <div className="flex flex-col mr-20">
            <h1 className="flex justify-center text-sm sm:text-lg md:text-xl">
              DEPARTMENT
            </h1>
            <h2 className="text-sm sm:text-xl md:text-2xl flex items-center">
              {getIcon(storedPersonDetails.known_for_department)}
              {storedPersonDetails.known_for_department}
            </h2>
          </div>
          <div className="flex flex-col mr-5 space-x-2">
            <h1 className="text-sm sm:text-lg md:text-xl">POPULARITY</h1>
            <h2 className="text-sm sm:text-xl md:text-2xl">
              <i className="fa-solid fa-heart text-red-500"></i>{" "}
              {storedPersonDetails.popularity.toFixed(1)}
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row  mx-5 p-5 space-y-5 md:space-y-0 shadow-2xl overflow-hidden">
        {/* Image Section */}
        <div className="w-full md:w-[30%] h-[60vh] md:h-[74vh] rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-105">
          <img
            src={`https://image.tmdb.org/t/p/w500/${storedPersonDetails.profile_path}`}
            alt={storedPersonDetails.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Biography Section */}
        <div className="w-full md:w-[70%] text-lg text-gray-700 dark:text-gray-300">
          <p className="p-4 text-2xl md:text-4xl font-semibold">
            {storedPersonDetails.also_known_as[0]}
          </p>
          <p className="p-4 text-lg md:text-2xl">
            <i className="fa-solid fa-cake-candles bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text"></i>{" "}
            {storedPersonDetails.birthday}
          </p>
          {storedPersonDetails.deathday && (
            <p className="p-4 text-lg md:text-2xl">
              <i className="fa-solid fa-skull bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text"></i>{" "}
              {storedPersonDetails.deathday}
            </p>
          )}
          <p className="p-4 text-lg md:text-2xl">
            Place of Birth: <i className="fa-solid fa-location-dot"></i>{" "}
            {storedPersonDetails.place_of_birth}
          </p>
          <p className="p-4 text-lg md:text-2xl h-[37vh] overflow-y-auto scrollbar-custom">
            {storedPersonDetails.biography}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndividualPerson;
