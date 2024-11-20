import React, { useState, useEffect } from "react";
import { BsBook } from "react-icons/bs";
import { IoPeopleSharp, IoPersonSharp } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { FaHouseChimney } from "react-icons/fa6";

const Modal = ({ exam, onClose, onSubmit }) => {
  const [assistant, setAssistant] = useState("");
  const [room, setRoom] = useState("");

  // Prevent scrolling on the background when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = () => {
    onSubmit({ ...exam, assistant, room });
  };

  const handleReset = () => {
    setAssistant("");
    setRoom("");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1b1e3d] p-8 rounded-lg shadow-lg max-w-lg w-full text-white"
        role="dialog"
        aria-labelledby="assign-room-title"
        aria-describedby="assign-room-desc"
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
      >
        <h1
          id="assign-room-title"
          className="text-3xl font-bold mb-6 text-center"
        >
          Assign Room
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          {/* Subject */}
          <div className="flex items-center space-x-2">
            <BsBook className="text-white h-6 w-6" />
            <h2 className="text-lg">Subject:</h2>
          </div>
          <h2 className="text-lg">{exam.subject}</h2>

          {/* Group */}
          <div className="flex items-center space-x-2">
            <IoPeopleSharp className="text-white h-6 w-6" />
            <h2 className="text-lg">Assigned to:</h2>
          </div>
          <h2 className="text-lg">{exam.group}</h2>

          {/* Hour */}
          <div className="flex items-center space-x-2">
            <CiClock2 className="text-white h-6 w-6" />
            <h2 className="text-lg">Hour:</h2>
          </div>
          <h2 className="text-lg">{exam.hour}</h2>

          {/* Assistant Field */}
          <div className="col-span-2">
            <label className="flex items-center space-x-2 text-lg mb-2">
              <IoPersonSharp className="text-white h-6 w-6" />
              <span>Assistant</span>
            </label>
            <input
              type="text"
              value={assistant}
              onChange={(e) => setAssistant(e.target.value)}
              className="w-full p-2 rounded border border-[#f9a825] bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#f9a825]"
            />
          </div>

          {/* Room Field */}
          <div className="col-span-2">
            <label className="flex items-center space-x-2 text-lg mb-2">
              <FaHouseChimney className="text-white h-6 w-6" />
              <span>Room</span>
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full p-2 rounded border border-[#f9a825] bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#f9a825]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleReset}
            className="px-6 py-2 border-2 border-[#f9a825] text-[#f9a825] rounded-lg hover:bg-[#f9a825] hover:text-[#1b1e3d] transition"
          >
            RESET
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#f9a825] text-[#1b1e3d] rounded-lg hover:bg-yellow-500 transition"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;