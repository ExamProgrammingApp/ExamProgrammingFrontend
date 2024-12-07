import React, { useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { useState } from "react";
import { BsBook } from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { FaHouseChimney } from "react-icons/fa6";
import Badge from "@mui/material/Badge";
import dayjs from "dayjs";
import axios from "axios";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//MARK EXAMS ON CALENDAR
function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const formattedDay = dayjs(day).format("YYYY-MM-DD");
  const isSelected =
    !outsideCurrentMonth && highlightedDays.includes(formattedDay);

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🔴" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

const Exams = () => {
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [selectedExam, setSelectedExam] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("access_token")); // presupunem că token-ul este în localStorage

  // GET EXAMS FOR THE CURRENT USER
  const fetchExams = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/exams`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const examsData = response.data;
      if (!Array.isArray(examsData)) {
        console.error("Data is not in the expected format");
        return;
      }
      const examDays = examsData.map(exam => {
        const dateObj = new Date(exam.date);
        return dayjs(dateObj).format("YYYY-MM-DD");
      });
      console.log("Exam Days:", examDays);
      setHighlightedDays(examDays);

    } catch (error) {
      console.error("Error fetching exams:", error.response || error.message);
    }
  };

  const fetchExamsByDate = async (date) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/exams/date/${date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Exams for selected date:", response.data);
      setSelectedExam(response.data);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error fetching exams by date:", error.response || error.message);
    }
  };

  useEffect(() => {
    console.log("useEffect fired");
    const token = localStorage.getItem("access_token");
    console.log('Token:', token);
    if (token) {
      fetchExams();
    } else {
      console.log("Token sau user nu sunt setate.");
    }
  }, [token]);

  const handleDayClick = (date) => {
    const selectedDate = date.format("YYYY-MM-DD");
    console.log("Selected date:", selectedDate);
    fetchExamsByDate(selectedDate);
  };

  const handleNext = () => {
    if (currentPage < selectedExam.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  return (
    <div className="h-[calc(100vh-64px)] w-auto bg-gray-1 flex p-5 space-x-10">
      <div className=" bg-orange-1 flex flex-1 flex-col items-center justify-start p-6 shadow-lg">
        <h1 className="text-4xl font-sans pt-5">Exams</h1>
        <div className="bg-white p-4 rounded-sm max-w-md mt-auto mb-auto">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              showDaysOutsideCurrentMonth
              fixedWeekNumber={6}
              views={["day"]}
              //onMonthChange={handleMonthChange}
              onChange={(date) => handleDayClick(date)}
              sx={{
                ".Mui-selected": {
                  backgroundColor: "#E1A23B !important",
                  color: "#FFFFFF !important",
                  "&:hover": {
                    backgroundColor: "#E1A23B !important",
                  },
                },
              }}
              slots={{
                day: ServerDay,
              }}
              slotProps={{
                day: {
                  highlightedDays,
                },
              }}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div className="flex-1 bg-blue-1 flex flex-col items-center justify-start p-6 shadow-lg">
        <h1 className="text-4xl font-sans pt-5 text-white">Exams Details</h1>
        <div className="max-w-md mt-auto mb-auto space-y-5">
          {selectedExam.length > 0 ? (
            <div className="space-y-2">
              <div className="flex flex-row items-center space-x-5">
                <BsBook className="text-white h-6 w-6" />
                <h1 className="text-2xl text-white min-w-32 ">Subject</h1>
                <h1 className="text-2xl text-white min-w-20">
                  {selectedExam[currentPage].subject}
                </h1>
              </div>
              <div className="flex flex-row items-center space-x-5">
                <IoPersonSharp className="text-white h-6 w-6" />
                <h1 className="text-2xl text-white min-w-32 ">Teacher</h1>
                <h1 className="text-2xl text-white min-w-20">
                  {selectedExam[currentPage].teacher.name}
                </h1>
              </div>
              <div className="flex flex-row items-center space-x-5">
                <IoPeopleSharp className="text-white h-6 w-6" />
                <h1 className="text-2xl text-white min-w-32 ">Assigned to</h1>
                <h1 className="text-2xl text-white min-w-20">
                  {selectedExam[currentPage].group}
                </h1>
              </div>
              <div className="flex flex-row items-center space-x-5">
                <CiClock2 className="text-white h-6 w-6" />
                <h1 className="text-2xl text-white min-w-32 ">Hour</h1>
                <h1 className="text-2xl text-white min-w-20">
                  {selectedExam[currentPage].startTime}
                </h1>
              </div>
              <div className="flex flex-row items-center space-x-5">
                <FaHouseChimney className="text-white h-6 w-6" />
                <h1 className="text-2xl text-white min-w-32 ">Room</h1>
                <h1 className="text-2xl text-white min-w-20">
                  <h1 className="text-2xl text-white min-w-20">
                    {selectedExam[currentPage].rooms?.map(room => room.name).join(', ') || 'N/A'}
                  </h1>
                </h1>
              </div>
              {selectedExam.length > 1 && (
                <div className="flex justify-between pt-8">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className={`px-4 py-2 rounded ${currentPage === 0
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-white"
                      }`}
                  >
                    Prev
                  </button>
                  <button
                    className="text-white bg-blue-1 border-white border-2 rounded-full w-24 h-10"
                    disabled={true}
                  >
                    {currentPage + 1} out of {selectedExam.length}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === selectedExam.length - 1}
                    className={`px-4 py-2 rounded ${currentPage === selectedExam.length - 1
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-white"
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <h2 className="text-2xl text-white">
              No exams scheduled for this day.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exams;
