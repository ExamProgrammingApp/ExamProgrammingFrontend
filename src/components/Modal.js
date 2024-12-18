import React, { useState, useEffect } from "react";
import { BsBook } from "react-icons/bs";
import { IoPeopleSharp, IoPersonSharp } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { FaHouseChimney } from "react-icons/fa6";
import { MdPersonSearch } from "react-icons/md";

const Modal = ({ exam, onClose, onSubmit, teachers, rooms }) => {
  const [assistant, setAssistant] = useState("");
  const [roomSelections, setRoomSelections] = useState([""]);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [disableConfirmation, setDisableConfirmation] = useState(false);
  const [warningState, setWarningState] = useState({
    warning: true,
    warningText: "Selected rooms don't meet student needs.",
  });

  // Prevent scrolling on the background when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const newCapacity = roomSelections
      .filter((roomId) => roomId)
      .reduce((acc, roomId) => {
        const room = rooms.find((room) => room.roomId === roomId);
        return acc + (room ? room.capacity : 0);
      }, 0);

    const percent = exam.numberOfStudents / newCapacity;
    if (percent < 0.6) {
      setDisableConfirmation(false);
      setWarningState({
        warning: true,
        warningText: "Selected rooms exceed student needs.",
      });
    } else if (exam.numberOfStudents > newCapacity) {
      setDisableConfirmation(true);
      setWarningState({
        warning: true,
        warningText: "Selected rooms don't meet student needs.",
      });
    } else {
      setDisableConfirmation(false);
      setWarningState({
        warning: false,
        warningText: "",
      });
    }

    setTotalCapacity(newCapacity);
  }, [roomSelections, exam.numberOfStudents, rooms]);

  // Adăugare câmp select pentru camere noi dacă este necesar

  const handleRoomChange = (index, value) => {
    setRoomSelections((prev) => {
      // Facem o copie a selecțiilor actuale
      const updatedSelections = [...prev];
      updatedSelections[index] = value; // Actualizăm selecția curentă

      // Calculăm capacitatea totală pe baza selecțiilor
      const newCapacity = updatedSelections
        .filter((roomId) => roomId) // Ignorăm selecțiile goale
        .reduce((acc, roomId) => {
          const room = rooms.find((room) => room.roomId === roomId);
          return acc + (room ? room.capacity : 0);
        }, 0);

      // const percent = exam.numberOfStudents / newCapacity;
      // if (percent < 0.6) {
      //   setDisableConfirmation(false);
      //   setWarningState({
      //     warning: true,
      //     warningText: "Selected rooms exceed student needs.",
      //   });
      // } else if (exam.numberOfStudents > newCapacity) {
      //   setDisableConfirmation(true);
      //   setWarningState({
      //     warning: true,
      //     warningText: "Selected rooms don't meet student needs.",
      //   });
      // } else {
      //   setDisableConfirmation(false);
      //   setWarningState({
      //     warning: false,
      //     warningText: "",
      //   });
      // }

      // Dacă totalCapacity este suficient, optimizăm selecțiile
      if (newCapacity >= exam.numberOfStudents) {
        // Sortăm camerele descrescător după capacitate
        const sortedRooms = updatedSelections
          .filter((roomId) => roomId) // Ignorăm selecțiile goale
          .map((roomId) => rooms.find((room) => room.roomId === roomId)) // Obținem camerele
          .sort((a, b) => b.capacity - a.capacity); // Sortăm descrescător

        // Optimizăm selecțiile pentru a păstra doar camerele necesare
        const optimizedSelections = [];
        let currentCapacity = 0;

        for (const room of sortedRooms) {
          if (currentCapacity < exam.numberOfStudents) {
            optimizedSelections.push(room.roomId);
            currentCapacity += room.capacity;
          }
        }

        // const percent = exam.numberOfStudents / newCapacity;
        // if (percent < 0.6) {
        //   setDisableConfirmation(false);
        //   setWarningState({
        //     warning: true,
        //     warningText: "Selected rooms exceed student needs.",
        //   });
        // } else if (exam.numberOfStudents > newCapacity) {
        //   setDisableConfirmation(true);
        //   setWarningState({
        //     warning: true,
        //     warningText: "Selected rooms don't meet student needs.",
        //   });
        // } else {
        //   setDisableConfirmation(false);
        //   setWarningState({
        //     warning: false,
        //     warningText: "",
        //   });
        // }

        return optimizedSelections;
      }

      // Dacă capacitatea nu este suficientă, adăugăm un câmp gol (pentru o nouă sală)
      if (
        newCapacity < exam.numberOfStudents &&
        !updatedSelections.includes("")
      ) {
        updatedSelections.push("");
      }

      return updatedSelections;
    });

    // După ce am actualizat selecțiile, recalculează capacitatea totală
    const updatedCapacity = roomSelections
      .filter((roomId) => roomId) // Eliminăm selecțiile goale
      .reduce((acc, roomId) => {
        const room = rooms.find((room) => room.roomId === roomId);
        return acc + (room ? room.capacity : 0);
      }, 0);
    console.log("room selections", roomSelections);

    setTotalCapacity(updatedCapacity); // Actualizăm capacitatea totală
  };

  const handleSubmit = () => {
    if (!assistant || totalCapacity < exam.numberOfStudents) {
      console.error(
        "Invalid selection: Assistant or insufficient room capacity."
      );
    } else {
      onSubmit({
        teacherAssistent: assistant,
        roomIds: roomSelections.filter((roomId) => roomId), // Eliminăm sălile necompletate
        examId: exam.examId,
      });
    }
  };

  const handleReset = () => {
    setAssistant("");
    setRoomSelections([""]);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-blue-1 p-8 rounded-lg shadow-lg max-w-lg w-full text-white"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-2">
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

          {/* Dynamic Room Fields */}
          <div className="w-full max-h-52 overflow-x-hidden overflow-y-auto scrollbar-hidden col-span-2 space-y-2">
            {roomSelections.map((roomId, index) => (
              <div className="col-span-2 p-1" key={index}>
                <label className="flex items-center space-x-2 text-lg mb-2">
                  <FaHouseChimney className="text-white h-6 w-6" />
                  <span>Room {index + 1}</span>
                </label>
                <select
                  value={roomId}
                  onChange={(e) => handleRoomChange(index, e.target.value)}
                  className={`w-full p-2 rounded border border-orange-1 bg-[#2e3a59] text-white focus:outline-none focus:ring-2 focus:ring-orange-1 ${
                    warningState.warning
                      ? "border-red-700 focus:ring-red-700"
                      : " border-orange-1"
                  }`}
                >
                  <option value="" disabled>
                    Select Room
                  </option>
                  {rooms
                    .filter(
                      (room) =>
                        !roomSelections.includes(room.roomId) || // Camerele nealese rămân disponibile
                        room.roomId === roomId // Păstrăm camera curent selectată
                    )
                    .map((room) => (
                      <option key={room.roomId} value={room.roomId}>
                        {room.name} : Capacity-{room.capacity}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>
        </div>
        {warningState.warning && (
          <h1 className="text-orange-1 text-md text-center pb-3">
            {warningState.warningText}
          </h1>
        )}
        {!warningState.warning && <div className="py-2"></div>}

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
            disabled={disableConfirmation}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
