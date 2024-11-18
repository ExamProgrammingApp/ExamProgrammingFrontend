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

  const isSelected =
    !outsideCurrentMonth && highlightedDays.includes(day.date());

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

//GENERATE FALSE EXAMS
function generateExams() {
  const subjects = ["IP", "CMO", "SI", "PDB", "SIIEP"];
  const teachers = ["Andrei", "Marian", "Radu", "Ionut", "Darius"];
  const groups = ["3141A", "3141B", "3142A", "3142B"];
  const hour = ["08:00", "10:00", "12:00", "14:00", "16:00"];
  const room = ["101", "202", "303", "404", "505"];

  function randomPick(list) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  const exams = [];
  for (let i = 0; i < 40; i++) {
    const examDetails = {
      exam: randomPick(subjects),
      teacher: randomPick(teachers),
      group: randomPick(groups),
      hour: randomPick(hour),
      date: `2024-${String(Math.floor(Math.random() * 4) + 9).padStart(
        2,
        "0"
      )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      room: randomPick(room),
    };
    exams.push(examDetails);
  }
  return exams;
}

//FILTER EXAMS BY MONTH
function groupExamDaysByMonth(examList) {
  const dataByMonth = {};

  examList.forEach((exam) => {
    const dateObj = new Date(exam.date);
    const month = dateObj.toLocaleString("en-US", { month: "long" });
    const day = String(dateObj.getDate()).padStart(2, "0");

    if (!dataByMonth[month]) {
      dataByMonth[month] = [];
    }

    dataByMonth[month].push(day);
  });

  return Object.entries(dataByMonth).map(([month, days]) => ({
    month,
    days,
  }));
}

//GET DAYS FOR CURRENT MONTH
function getDays(monthIndex, examList) {
  const currentMonth = months[monthIndex];
  const monthData = examList.find((exam) => exam.month === currentMonth);
  if (monthData) {
    return monthData.days.map((day) => parseInt(day, 10));
  } else {
    return [];
  }
}

const Exams = () => {
  const [currentMonth, setCurrentMonth] = useState(null);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [groupedExams, setGroupedExams] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const handleMonthChange = (date) => {
    const monthIndex = date.month();
    setCurrentMonth(monthIndex);
    const daysForCurrentMonth = getDays(monthIndex, groupedExams);
    setHighlightedDays(daysForCurrentMonth);
  };

  const handleDayClick = (date) => {
    const selectedDate = date.format("YYYY-MM-DD");
    const selected = exams.filter((exam) => exam.date === selectedDate);
    setSelectedExam(selected);
    setCurrentPage(0);
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

  //GENERATES NEW EXAMS ON PAGE LOAD
  useEffect(() => {
    const generatedExams = generateExams();
    setExams(generatedExams);
    const groupedExamDates = groupExamDaysByMonth(generatedExams);
    setGroupedExams(groupedExamDates);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] w-auto bg-gray-1 flex p-10 space-x-10">
      <div className=" bg-orange-1 flex flex-1 flex-col items-center justify-start p-6 shadow-lg">
        <h1 className="text-4xl font-sans pt-5">Exams</h1>
        <div className="bg-white p-4 rounded-sm max-w-md mt-auto mb-auto">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              showDaysOutsideCurrentMonth
              fixedWeekNumber={6}
              views={["day"]}
              onMonthChange={handleMonthChange}
              onChange={(date) => handleDayClick(date)}
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
                  {selectedExam[currentPage].exam}
                </h1>
              </div>
              <div className="flex flex-row items-center space-x-5">
                <IoPersonSharp className="text-white h-6 w-6" />
                <h1 className="text-2xl text-white min-w-32 ">Teacher</h1>
                <h1 className="text-2xl text-white min-w-20">
                  {selectedExam[currentPage].teacher}
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
                  {selectedExam[currentPage].hour}
                </h1>
              </div>
              <div className="flex flex-row items-center space-x-5">
                <FaHouseChimney className="text-white h-6 w-6" />
                <h1 className="text-2xl text-white min-w-32 ">Room</h1>
                <h1 className="text-2xl text-white min-w-20">
                  {selectedExam[currentPage].room}
                </h1>
              </div>
              {selectedExam.length > 1 && (
                <div className="flex justify-between pt-8">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className={`px-4 py-2 rounded ${
                      currentPage === 0
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  >
                    Prev
                  </button>
                  <button
                    className="text-white bg-blue-1 border-white border-2 rounded-full w-10 h-10"
                    disabled={true}
                  >
                    {currentPage + 1}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === selectedExam.length - 1}
                    className={`px-4 py-2 rounded ${
                      currentPage === selectedExam.length - 1
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
