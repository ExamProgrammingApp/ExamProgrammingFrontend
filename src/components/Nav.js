import React from "react";
import {Link} from "react-router-dom";

const Nav = () => {
  return (
    <div className="flex flex-col w-40 bg-cyan-500 h-screen justify-start">
      <Link to="/"> Home</Link>
      <Link to="/exams">Exams</Link>
      <Link to="/program_exam"> Program Exam</Link>
    </div>
  );
};

export default Nav;
