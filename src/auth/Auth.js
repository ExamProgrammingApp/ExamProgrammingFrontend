import AuthImage from "../assets/images/auth_img.png";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth, getUserPath } from "./AuthContext";
import axios from "axios";
import { getUserById } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const signIn = () => {
    navigate("/exams");
  };

  const setUserType = onLogin;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isCooldownActive) {
      toast.warning(`Please wait ${cooldown} seconds before trying again.`);
      return;
    }

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
        console.log("Token :", access_token);

        await saveName(response.data["id"]);

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("role", role);
        login({ email, role, token: access_token });
        setUserType(role);
        navigate(getUserPath(role));

        setFailedAttempts(0);
        setCooldown(0);
        setIsCooldownActive(false);
      }
    } catch (error) {
      console.error("Login error: ", error);
      handleFailedAttempt();
    }
  };

  const handleFailedAttempt = () => {
    const newFailedAttempts = failedAttempts + 1;
    setFailedAttempts(newFailedAttempts);

    if (newFailedAttempts >= 10) {
      setCooldown(15);
    } else if (newFailedAttempts >= 5) {
      setCooldown(5);
    }

    if (newFailedAttempts >= 5) {
      setIsCooldownActive(true);
      const cooldownInterval = setInterval(() => {
        setCooldown((prevCooldown) => {
          if (prevCooldown <= 1) {
            clearInterval(cooldownInterval);
            setIsCooldownActive(false);
            return 0;
          }
          return prevCooldown - 1;
        });
      }, 1000);
    }

    toast.error("Invalid credentials! Please try again.");
  };

  const continueWIthoutLogin = () => {
    const user = defaultUser["user@user.com"];
    login({ email, role: user.role });
    onLogin(user.role);
    navigate(getUserPath(user.role));
  };

  return (
    <div className="h-screen w-screen bg-blue-1 flex flex-row p-10 space-x-5 ">
      <ToastContainer position="top-right" autoClose={3000} />
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
          <div className="text-white text-lg font-semibold">OR</div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-1"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-1"
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "🐵"}
            </button>
          </div>
          <button
            className={`bg-orange-1 text-white font-semibold py-2 px-6 rounded-md w-full hover:bg-orange-1 hover:text-white ${
              isCooldownActive ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={(e) => handleLogin(e)}
            disabled={isCooldownActive}
          >
            {isCooldownActive ? `Wait ${cooldown}s` : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
