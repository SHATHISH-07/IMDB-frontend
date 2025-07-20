import { useState } from "react";

const DropDown = ({ selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option.toLowerCase());
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 text-white bg-gray-600 rounded-md  w-[105px]"
      >
        {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
        {"  "} <i className="fa-solid fa-caret-down"></i>
      </button>

      {isOpen && (
        <div className="absolute z-20 right-0 left-0 mt-2 w-40 bg-white border border-gray-300 dark:bg-black dark:border-gray-600 rounded-md shadow-lg">
          <ul className="py-2">
            <li
              onClick={() => handleSelect("movie")}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-600"
            >
              Movie
            </li>
            <li
              onClick={() => handleSelect("tv")}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-600"
            >
              Tv Show
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDown;
