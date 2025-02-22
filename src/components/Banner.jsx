import React from "react";

const Banner = () => {
  return (
    <div className="dark:text-white text-gray-900 py-10">
      {/* Hero Section */}
      <section className="px-6 py-16 text-center bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 dark:from-gray-900 dark:via-gray-700 dark:to-gray-900 shadow-2xl ">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to MovieWorld <i className="fa-solid fa-film"></i>
        </h1>
        <p className="text-lg  text-gray-600 dark:text-gray-300 mb-8">
          Explore the best movies and trailers, Now!
        </p>
      </section>
    </div>
  );
};

export default Banner;
