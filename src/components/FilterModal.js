import React, { useState, useEffect } from "react";

function getData(setGroups, setTeachers, setSubjects, setRooms) {
  //GET DATA FROM DATABASE

  setGroups(["3141A", "3141B", "3142A", "3142B"]);
  setTeachers(["Andrei", "Marian", "Radu", "Ionut", "Darius"]);
  setSubjects(["IP", "CMO", "SI", "PDB", "SIIEP"]);
  setRooms(["101", "202", "303", "404", "505"]);
}

const FilterModal = ({ onClose, onSubmit, usedFilters }) => {
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const [groupChecked, setGroupChecked] = useState(false);
  const [teacherChecked, setTeacherChecked] = useState(false);
  const [subjectChecked, setSubjectChecked] = useState(false);
  const [roomChecked, setRoomChecked] = useState(false);

  // Prevent scrolling on the background when modal is open
  useEffect(() => {
    //GET DATA FROM API
    getData(setGroups, setTeachers, setSubjects, setRooms);

    if (usedFilters && usedFilters.length > 0) {
      usedFilters.forEach(({ filter, value }) => {
        if (filter === "Group") {
          setSelectedGroup(value);
          setGroupChecked(true);
        } else if (filter === "Teacher") {
          setSelectedTeacher(value);
          setTeacherChecked(true);
        } else if (filter === "Subject") {
          setSelectedSubject(value);
          setSubjectChecked(true);
        } else if (filter === "Room") {
          setSelectedRoom(value);
          setRoomChecked(true);
        }
      });
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [usedFilters]);

  const handleSubmit = () => {
    const selectedFilters = [];

    if (groupChecked && selectedGroup) {
      selectedFilters.push({ filter: "Group", value: selectedGroup });
    }
    if (teacherChecked && selectedTeacher) {
      selectedFilters.push({ filter: "Teacher", value: selectedTeacher });
    }
    if (subjectChecked && selectedSubject) {
      selectedFilters.push({ filter: "Subject", value: selectedSubject });
    }
    if (roomChecked && selectedRoom) {
      selectedFilters.push({ filter: "Room", value: selectedRoom });
    }

    onSubmit(selectedFilters);
  };

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const handleTeacherChange = (event) => {
    setSelectedTeacher(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {" "}
      <div
        className="bg-[#1b1e3d] p-8 rounded-lg shadow-lg max-w-lg w-full text-white"
        role="dialog"
        aria-labelledby="assign-room-title"
        aria-describedby="assign-room-desc"
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
      >
        <h1
          id="assign-room-title"
          className="text-3xl font-bold mb-8 text-center"
        >
          Filter
        </h1>
        <div className="flex flex-col space-y-5 justify-center items-center">
          <div className="flex flex-row justify-evenly w-full">
            <input
              type="checkbox"
              checked={groupChecked}
              onChange={(e) => setGroupChecked(e.target.checked)}
            />
            <h1 className="text-white text-3xl">Group</h1>
            <select
              value={selectedGroup}
              onChange={handleGroupChange}
              className="w-40 h-10 rounded-md bg-gray-1 text-black text-end pr-3"
            >
              <option value="" disabled>
                Select a group
              </option>
              {groups.length > 0 &&
                groups.map((group, index) => (
                  <option key={index} value={group}>
                    {group}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-row justify-evenly w-full">
            <input
              type="checkbox"
              checked={teacherChecked}
              onChange={(e) => setTeacherChecked(e.target.checked)}
            />
            <h1 className="text-white text-3xl">Teacher</h1>
            <select
              value={selectedTeacher}
              onChange={handleTeacherChange}
              className="w-40 h-10 rounded-md bg-gray-1 text-black text-end pr-3"
            >
              <option value="" disabled>
                Select a teacher
              </option>
              {teachers.length > 0 &&
                teachers.map((teacher, index) => (
                  <option key={index} value={teacher}>
                    {teacher}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-row justify-evenly w-full">
            <input
              type="checkbox"
              checked={subjectChecked}
              onChange={(e) => setSubjectChecked(e.target.checked)}
            />
            <h1 className="text-white text-3xl">Subject</h1>
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="w-40 h-10 rounded-md bg-gray-1 text-black text-end pr-3"
            >
              <option value="" disabled>
                Select a subject
              </option>
              {subjects.length > 0 &&
                subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-row justify-evenly w-full pb-5">
            <input
              type="checkbox"
              checked={roomChecked}
              onChange={(e) => setRoomChecked(e.target.checked)}
            />
            <h1 className="text-white text-3xl">Room</h1>
            <select
              value={selectedRoom}
              onChange={handleRoomChange}
              className="w-40 h-10 rounded-md bg-gray-1 text-black text-end pr-3"
            >
              <option value="" disabled>
                Select a room
              </option>
              {rooms.length > 0 &&
                rooms.map((room, index) => (
                  <option key={index} value={room}>
                    {room}
                  </option>
                ))}
            </select>
          </div>
          <button
            className="bg-orange-1 w-40 h-12 text-3xl rounded-md"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
