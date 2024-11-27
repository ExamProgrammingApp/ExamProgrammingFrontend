import React, { useEffect, useState } from "react";
import { TbPencilMinus } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import Modal from "../components/Modal";
import { confirmExam, fetchExamsByGroupOrSubject, deleteExam } from "../api";

const ConfirmExam = () => {
  const [exams, setExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const itemsPerPage = 10;

  // Fetch exams when the component mounts
  useEffect(() => {
    const loadExams = async () => {
      try {
        // Replace "3141A" and "IP" with dynamic or default filters as needed
        const examsData = await fetchExamsByGroupOrSubject("IP");
        setExams(examsData);
      } catch (error) {
        console.error("Error loading exams:", error);
      }
    };

    loadExams();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExams = exams.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(exams.length / itemsPerPage);

  const handleConfirm = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  const handleReject = async (id) => {
    try {
      await deleteExam(id); // API call to delete the exam
      setExams((prevExams) => prevExams.filter((exam) => exam.id !== id));
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  const handleModalSubmit = async (updatedExam) => {
    try {
      const confirmedExam = await confirmExam({
        ...updatedExam,
        confirmed: true,
      });
      setExams((prevExams) =>
        prevExams.map((exam) =>
          exam.id === confirmedExam.id ? confirmedExam : exam
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error confirming exam:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-auto bg-gray-1 flex p-5 space-x-10">
      <div className="flex-1 bg-blue-1 flex flex-col items-center justify-start p-3 shadow-lg">
        <h1 className="text-4xl font-sans text-white">Confirm Exam</h1>
        <table className="table-auto w-full bg-white rounded-lg mt-5 overflow-hidden">
          <thead className="bg-orange-1 text-white text-lg">
            <tr>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Teacher</th>
              <th className="px-4 py-2">Group</th>
              <th className="px-4 py-2">Hour</th>
              <th className="px-4 py-2">Room</th>
              <th className="px-4 py-2">Actions</th>
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
                <td className="px-4 py-2">{exam.subject}</td>
                <td className="px-4 py-2">{exam.teacher}</td>
                <td className="px-4 py-2">{exam.group}</td>
                <td className="px-4 py-2">{exam.hour}</td>
                <td className="px-4 py-2">{exam.room || "N/A"}</td>
                <td className="px-4 py-2 flex justify-center space-x-4">
                  <button
                    onClick={() => handleConfirm(exam)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <TbPencilMinus size={24} />
                  </button>
                  <button
                    onClick={() => handleReject(exam.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <IoClose size={24} />
                  </button>
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
          <Modal
            exam={selectedExam}
            onClose={() => setShowModal(false)}
            onSubmit={handleModalSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ConfirmExam;