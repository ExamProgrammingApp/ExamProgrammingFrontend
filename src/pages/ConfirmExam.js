import React, { useEffect, useState } from "react";
import { TbPencilMinus } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import Modal from "../components/Modal";
import {
  confirmExam,
  rejectExam,
  fetchExamsByGroupOrSubject,
  deleteExam,
  fetcheExamByTeacherId,
} from "../api";
import axios from "axios";

const ConfirmExam = () => {
  const [exams, setExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null); // Stochează profesorul selectat
  const [selectedRoom, setSelectedRoom] = useState(null);
  const itemsPerPage = 10;

  // Fetch exams when the component mounts
  useEffect(() => {
    const loadExams = async () => {
      try {
        const examsData = await fetcheExamByTeacherId(); // Correct invocation
        if (Array.isArray(examsData)) {
          console.log("Fetched exams:", examsData);
          setExams(examsData);
        } else {
          console.error("Invalid data format, expected an array:", examsData);
          setExams([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error loading exams:", error);
        setExams([]); // Fallback to an empty array
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/teachers`
        );
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/rooms`
        );
        setRooms(response.data); // Setează camerele în state
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
    loadExams();
    fetchTeachers(); // Fetch the teachers list
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExams = exams.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(exams.length / itemsPerPage));

  const handleConfirm = async (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  const handleReject = async (examId) => {
    console.log("Rejecting exam with ID:", examId);
    try {
      await rejectExam(examId); // API call to delete the exam
      setExams((prevExams) =>
        prevExams.filter((exam) => exam.examId !== examId)
      );
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  const handleModalSubmit = async ({ teacherAssistent, roomIds, examId }) => {
    try {
      console.log("Submitting to confirmExam:", examId);

      await confirmExam({ teacherAssistent, roomIds }, examId);

      setExams((prevExams) =>
        prevExams.filter((exam) => exam.examId !== examId)
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
              <th className="px-4 py-2">Number of students</th>
              <th className="px-4 py-2">Group</th>
              <th className="px-4 py-2">Hour</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 ||
            exams[0] === "" ||
            currentExams.length === 0 ||
            currentExams[0] === "" ? (
              <tr>
                <td colSpan={6} className="text-center py-4 ">
                  No exams found
                </td>
              </tr>
            ) : (
              currentExams.map((exam) => (
                <tr
                  key={exam.id}
                  className={`text-center border-b ${
                    exam.confirmed === true ? "bg-green-100" : ""
                  }`}
                >
                  <td className="px-4 py-2">{exam.subject}</td>
                  <td className="px-4 py-2">{exam.numberOfStudents}</td>
                  <td className="px-4 py-2">{exam.group}</td>
                  <td className="px-4 py-2">
                    {exam.startTime.split(":").slice(0, 2).join(":")}
                  </td>
                  <td className="px-4 py-2">{exam.date}</td>
                  <td className="px-4 py-2 flex justify-center space-x-4">
                    <button
                      onClick={() => handleConfirm(exam)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <TbPencilMinus size={24} />
                    </button>
                    <button
                      onClick={() => {
                        handleReject(exam.examId);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <IoClose size={24} />
                    </button>
                  </td>
                </tr>
              ))
            )}
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
            teachers={teachers}
            rooms={rooms}
          />
        )}
      </div>
    </div>
  );
};

export default ConfirmExam;
