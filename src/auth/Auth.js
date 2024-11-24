import React from "react";
import AuthImage from "../assets/images/auth_img.png";
import {useNavigate} from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const signIn = () => {
    navigate("/exams");
  };

  const login = () => {
    navigate("/exams");
  };

  const googleLogin = () => {
    navigate("/exams");
  };

  return (
    
    <div className="h-screen w-screen bg-blue-1 flex flex-row p-10 space-x-5 ">
      <div className="h-full bg-gray-1 flex-1 content-center justify-items-center p-5 overflow-hidden">
        <img
          src={AuthImage}
          alt="A building"
          className="h-full w-full max-h-[500px] max-w-[500px]"
        />
      </div>
      <div className=" flex flex-1 justify-center ">
        <div className="flex flex-col items-center justify-center space-y-6 p-10 rounded-lg w-full h-full flex-1 max-w-[500px]">
          <button
            className="bg-orange-500 text-white text-lg font-semibold py-3 px-6 rounded-md hover:bg-orange-600"
            onClick={() => signIn()}>
            Sign in
          </button>
          <button
            className="bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-md flex items-center w-full justify-center hover:bg-gray-300"
            onClick={() => googleLogin()}>
            Continue with Google
          </button>
          <div className="text-white text-lg font-semibold">OR</div>
          <input
            type="text"
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            className="border border-orange-500 text-orange-500 font-semibold py-2 px-6 rounded-md w-full hover:bg-orange-500 hover:text-white"
            onClick={() => login()}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
