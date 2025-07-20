import { useState } from "react";
import { Link } from "react-router-dom";

const SignUpSection = ({ handleSignUp }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSignUp({ username, password, name });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300 dark:bg-gray-800 px-4 sm:px-6 lg:px-8 ">
      <div className="bg-gray-900 m-4 dark:bg-gray-900 text-gray-100 dark:text-gray-300 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-6 text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={({ target }) => setName(target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 dark:bg-gray-700 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 dark:bg-gray-700 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 dark:bg-gray-700 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpSection;
