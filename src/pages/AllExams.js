import React, { useEffect, useState } from "react";
import FilterModal from "../components/FilterModal";

const generateExams = () => {
  const subjects = ["IP", "CMO", "SI", "PDB", "SIIEP"];
  const teachers = ["Andrei", "Marian", "Radu", "Ionut", "Darius"];
  const groups = ["3141A", "3141B", "3142A", "3142B"];
  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00"];
  const rooms = ["101", "202", "303", "404", "505"];

  const randomPick = (list) => list[Math.floor(Math.random() * list.length)];

  return Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    subject: randomPick(subjects),
    teacher: randomPick(teachers),
    group: randomPick(groups),
    hour: randomPick(hours),
    room: randomPick(rooms),
    date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(
      2,
      "0"
    )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    confirmed: null, // Initial state for confirmation (null, true, or false)
  }));
};

const orderExams = (exams) => {
  return exams.sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.hour}`);
    const dateTimeB = new Date(`${b.date}T${b.hour}`);
    return dateTimeA - dateTimeB;
  });
};

const AllExams = () => {
  const [exams, setExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    setExams(orderExams(generateExams()));
  }, []);

  const ShowModal = () => {
    setShowModal(true);
  };

  const handleModalSubmit = (filters) => {
    let filteredExams = [...exams];

    filters.forEach(({ filter, value }) => {
      if (filter === "Group") {
        filteredExams = filteredExams.filter((exam) => exam.group === value);
      } else if (filter === "Teacher") {
        filteredExams = filteredExams.filter((exam) => exam.teacher === value);
      } else if (filter === "Subject") {
        filteredExams = filteredExams.filter((exam) => exam.subject === value);
      } else if (filter === "Room") {
        filteredExams = filteredExams.filter((exam) => exam.room === value);
      }
    });
    setExams(filteredExams);
    setCurrentPage(1);

    setShowModal(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExams = exams.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(exams.length / itemsPerPage);

  return (
    <div className="h-[calc(100vh-64px)] w-auto bg-gray-1 flex p-5 space-x-10">
      <div className="flex-1 bg-blue-1 flex flex-col items-center justify-center p-3 shadow-lg">
        <div className="flex flex-row w-full items-center relative">
          <h1 className="text-4xl font-sans text-white absolute left-1/2 transform -translate-x-1/2">
            Confirm Exam
          </h1>
          <button
            onClick={() => ShowModal()}
            className="bg-gray-1 px-4 py-2 rounded disabled:opacity-50 ml-auto"
          >
            Filter
          </button>
        </div>
        <table className="table-auto w-full bg-white rounded-lg mt-5 overflow-hidden">
          <thead className="bg-orange-1 text-white text-lg">
            <tr>
              <th className="px-4 py-2">Teacher</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Group</th>
              <th className="px-4 py-2">Room</th>
              <th className="px-4 py-2">Date and time</th>
            </tr>
          </thead>
          <tbody>
            {currentExams.map((exam) => (
              <tr
                key={exam.id}
                className={`text-center border-b ${
                  exam.confirmed === true ? "bg-green-100" : ""
                }`}
              >
                <td className="px-4 py-2">{exam.teacher}</td>
                <td className="px-4 py-2">{exam.subject}</td>
                <td className="px-4 py-2">{exam.group}</td>
                <td className="px-4 py-2">{exam.room}</td>
                <td className="px-4 py-2">
                  {exam.date}, {exam.hour}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-5 space-x-8 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-1 px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-white text-xl">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-1 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        {showModal && (
          <FilterModal
            onClose={() => setShowModal(false)}
            onSubmit={handleModalSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default AllExams;
