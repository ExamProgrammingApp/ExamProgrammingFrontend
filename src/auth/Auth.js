import AuthImage from "../assets/images/auth_img.png";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const users = {
  "user@user.com": { password: "user", role: "user" },
  "student@student.com": { password: "student", role: "student" },
  "headstudent@student.com": {
    password: "headstudent",
    role: "headstudent",
  },
  "teacher@teacher.com": { password: "teacher", role: "teacher" },
};

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const signIn = () => {
    navigate("/exams");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users[email];

    if (user && user.password === password) {
      login({ email, role: user.role });
      onLogin(user.role);
      if (user.role === "teacher") navigate("/confirm_exam");
      else navigate("/exams");
    } else {
      alert("Credențiale invalide!");
    }
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
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            className="border border-orange-500 text-orange-500 font-semibold py-2 px-6 rounded-md w-full hover:bg-orange-500 hover:text-white"
            onClick={(e) => handleLogin(e)}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
