import React from "react";
import {Link, useLocation} from "react-router-dom";
import {FaCalendarAlt} from "react-icons/fa";
import {FaPenToSquare} from "react-icons/fa6";
import {FaRegPlusSquare} from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import logo from "../assets/images/logo.png";

const SideNavbar = () => {
  const location = useLocation();
  //Path without navbar
  if (location.pathname === "/auth") return null;

  return (
    <div className="flex flex-col items-center space-y-6 sticky top-0 min-w-24 h-screen bg-blue-1 justify-start">
      <img src={logo} alt="Logo" className="w-[70px]" />
      <Link to="/exams">
        <div
          className={`w-16 h-16 ${
            location.pathname === "/exams" ? "bg-orange-1" : "bg-blue-1"
          } hover:bg-orange-1 content-center justify-items-center rounded-md`}
        >
          <FaCalendarAlt className="w-10 h-10 text-white" />
        </div>
      </Link>
      <Link to="/modify_exam">
        <div
          className={`w-16 h-16 ${
            location.pathname === "/modify_exam" ? "bg-orange-1" : "bg-blue-1"
          } hover:bg-orange-1 content-center justify-items-center rounded-md`}
        >
          <FaPenToSquare className="w-10 h-10 text-white" />
        </div>
      </Link>
      <Link to="/program_exam">
        <div
          className={`w-16 h-16 ${
            location.pathname === "/program_exam" ? "bg-orange-1" : "bg-blue-1"
          } hover:bg-orange-1 content-center justify-items-center rounded-md`}
        >
          <FaRegPlusSquare className="w-10 h-10 text-white" />
        </div>
      </Link>
      <Link to="/confirm_exam">
        <div
          className={`w-16 h-16 ${
            location.pathname === "/confirm_exam" ? "bg-orange-1" : "bg-blue-1"
          } hover:bg-orange-1 content-center justify-items-center rounded-md`}>
          <FaCheck className="w-10 h-10 text-white" />
        </div>
      </Link>

    </div>
  );
};

export default SideNavbar;
