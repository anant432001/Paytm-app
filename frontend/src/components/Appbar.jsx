import React from "react";
import { useNavigate } from "react-router-dom";

export const Appbar = () => {
  const navigate = useNavigate();

  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const fullName = `${firstName} ${lastName}`;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="shadow h-14 flex justify-between items-center px-4">
      <div className="flex flex-col justify-center">
        <span className="text-lg font-bold">PayTM App</span>
      </div>
      <div className="flex items-center">
        <div className="mr-4 flex items-center">
          <span className="text-sm">Hello, {firstName}</span>
        </div>
        <div className="relative group">
          <button
            onClick={handleLogout}
            className="ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
          {/* <div className="absolute bottom-0 mb-6 hidden group-hover:flex flex-col items-center">
            <span className="relative z-10 p-2 text-xs leading-none text-white bg-gray-800 shadow-lg rounded-md whitespace-no-wrap">
              {fullName}
            </span>
            <div className="w-3 h-3 -mt-1 rotate-45 bg-gray-800"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
