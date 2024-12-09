import AuthImage from "../assets/images/auth_img.png";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth, getUserPath } from "./AuthContext";
import axios from "axios";
import { getUserById } from "../api";

async function saveName(id) {
  try {
    const response = await getUserById(id);
    localStorage.setItem("userName", JSON.stringify(response["name"]));
  } catch (error) {
    console.error("Error saving name: ", error);
  }
}

const defaultUser = { "user@user.com": { password: "user", role: "user" } };

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const signIn = () => {
    navigate("/exams");
  };
  const setUserType = onLogin;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("Email:", email, "Password:", password);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      const { access_token, role } = response.data;

      if (access_token) {
        console.log("Token obținut:", access_token);

        saveName(response.data["id"]);

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("role", role);
        login({ email, role, token: access_token });
        setUserType(role);
        navigate(getUserPath(role));
      }
    } catch (error) {
      alert("Credențiale invalide!");
      console.error("Login error: ", error);
    }
  };

  const continueWIthoutLogin = () => {
    const user = defaultUser["user@user.com"];
    login({ email, role: user.role });
    onLogin(user.role);
    navigate(getUserPath(user.role));
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
            className="bg-gray-1 text-black text-lg font-semibold py-3 rounded-md px-6 mb-28 hover:bg-white hover:text-orange-1 ease-in duration-300"
            onClick={() => continueWIthoutLogin()}
          >
            Continue without login
          </button>
          <button
            className="bg-orange-1 text-white text-lg font-semibold py-3 px-6 rounded-md hover:bg-orange-500"
            onClick={() => signIn()}
          >
            Sign in
          </button>
          <div className="text-white text-lg font-semibold">OR</div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-1"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-1"
          />
          <button
            className="bg-orange-1 text-white font-semibold py-2 px-6 rounded-md w-full hover:bg-orange-500 hover:text-white"
            onClick={(e) => handleLogin(e)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
