import React, { useState, useEffect } from "react";
import { BsBook } from "react-icons/bs";
import { IoPeopleSharp, IoPersonSharp } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { FaHouseChimney } from "react-icons/fa6";
import { MdPersonSearch } from "react-icons/md";

const Modal = ({ exam, onClose, onSubmit, teachers, rooms }) => {
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
    if (!assistant || !room) {
      console.error("Assistant or Room not selected.");
      return; // Nu trimite date dacă unul dintre câmpuri este gol
    }
    onSubmit({
      teacherAssistent: assistant,
      roomIds: [room],
      examId: exam.examId,
    });
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

          {/* Number of students */}
          <div className="flex items-center space-x-2">
            <IoPeopleSharp className="text-white h-6 w-6" />
            <h2 className="text-lg">Number of students:</h2>
          </div>
          <h2 className="text-lg">{exam.numberOfStudents}</h2>

          {/* Group */}
          <div className="flex items-center space-x-2">
            <MdPersonSearch className="text-white h-6 w-6" />
            <h2 className="text-lg">Assigned to:</h2>
          </div>
          <h2 className="text-lg">{exam.group}</h2>

          {/* Hour */}
          <div className="flex items-center space-x-2">
            <CiClock2 className="text-white h-6 w-6" />
            <h2 className="text-lg">Date:</h2>
          </div>
          <h2 className="text-lg">
            {exam.startTime.split(":").slice(0, 2).join(":")} {exam.date}
          </h2>

          {/* Assistant Field */}
          <div className="col-span-2">
            <label className="flex items-center space-x-2 text-lg mb-2">
              <IoPersonSharp className="text-white h-6 w-6" />
              <span>Assistant</span>
            </label>
            <select
              value={assistant}
              onChange={(e) => setAssistant(e.target.value)}
              className="w-full p-2 rounded border border-orange-1 bg-blue-1 text-white focus:outline-none focus:ring-2 focus:ring-orange-1"
            >
              <option value="">Select Assistant</option>
              {teachers.map((teacher) => (
                <option key={teacher.teacherId} value={teacher.teacherId}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          {/* Room Field */}
          <div className="col-span-2">
            <label className="flex items-center space-x-2 text-lg mb-2">
              <FaHouseChimney className="text-white h-6 w-6" />
              <span>Room</span>
            </label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full p-2 rounded border border-orange-1 bg-[#2e3a59] text-white focus:outline-none focus:ring-2 focus:ring-orange-1"
            >
              <option value="" disabled>
                Select Room
              </option>
              {rooms.map((roomItem) => (
                <option key={roomItem.roomId} value={roomItem.roomId}>
                  {roomItem.name} : Capacity-{roomItem.capacity}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleReset}
            className="px-6 py-2 border-2 border-orange-1 text-orange-1 rounded-lg hover:bg-orange-1 hover:text-[#1b1e3d] transition"
          >
            RESET
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-orange-1 text-[#1b1e3d] rounded-lg hover:bg-orange-1 transition"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
