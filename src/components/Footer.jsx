import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = ({ currentUser }) => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-800 dark:bg-black text-white py-6 ">
      <div className=" mx-auto md:px-6">
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-center pb-5 hover:text-blue-400 cursor-pointer"
        >
          Back To Top
        </div>
        <div className="flex flex-col justify-center items-center sm:justify-center  sm:flex-row  sm:space-x-10  mb-6">
          <a
            href="/about"
            className="text-lg hover:text-blue-400 px-10 md:px-0"
          >
            About
          </a>
          <a href="/contact" className="text-lg hover:text-blue-400">
            Contact
          </a>
          <a href="/privacy-policy" className="text-lg hover:text-blue-400">
            Privacy Policy
          </a>
          <a href="/terms" className="text-lg hover:text-blue-400">
            Terms of Service
          </a>
        </div>
        <div
          onClick={() => {
            if (!currentUser) {
              navigate("/login");
            }
          }}
          className="text-lg hover:text-blue-400 cursor-pointer flex justify-center  pb-5"
        >
          {currentUser ? (
            <>
              <i className="fa-solid fa-user p-1"></i> {currentUser.name}
            </>
          ) : (
            "Sign In"
          )}
        </div>

        <div className="flex justify-center px-10 md:px-0 space-x-6 mb-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg hover:text-blue-400"
          >
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg hover:text-blue-400"
          >
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg hover:text-blue-400"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
        </div>
        <div className="text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} IMDb Clone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
