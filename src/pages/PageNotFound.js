import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserPath } from "../auth/AuthContext";

const PageNotFound = ({ resetUser }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState();

  const handleGoBack = () => {
    navigate(getUserPath(userRole));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = JSON.parse(storedUser);
    setUserRole(user.role);
    resetUser(user.role);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-1 p-5">
      <div className="h-full bg-blue-1 flex flex-col items-center justify-center">
        <h1 className="text-white text-5xl p-10">OOOPPPSSS!</h1>
        <h1 className="text-white text-3xl">
          The page you're looking for doesn't exist
        </h1>
        <h1 className="text-white text-3xl pb-5">We advise you to go back</h1>
        <button
          onClick={handleGoBack}
          className="bg-gray-1 text-2xl py-3 rounded-full w-40 mb-20"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
