import React, { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

const timeOptions = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
];

function getDate(date = new Date()) {
  const today = date;

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const [weekday, month, day] = formattedDate.split(" ");

  const capitalizedDate = `${capitalize(weekday)} ${capitalize(month)} ${day}`;

  return capitalizedDate;
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
  for (let i = 0; i < 10; i++) {
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

const EditExams = () => {
  const [selectedExamIndex, setSelectedExamIndex] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [calendarDate, setCalendarDate] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examDate, setExamDate] = useState(getDate());
  const [exams, setExams] = useState([]);

  const notify = (text = "Success") => toast.success(text);

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleDayClick = (date) => {
    if (date) {
      const newDate = date.toDate();
      setExamDate(getDate(newDate));
      setCalendarDate(date);
    }
  };

  const handleResetClick = () => {
    setSelectedTime(selectedExam.hour);
    const selectedDate = dayjs(selectedExam.date);
    setCalendarDate(selectedDate);
  };

  const handleEditClick = () => {
    //Necessary validation
    notify("Edit made successfully");
  };

  const SelectExam = (exam, index) => {
    setSelectedExam(exam);
    setSelectedExamIndex(index);
    const selectedDate = dayjs(exam.date);
    setExamDate(getDate(new Date(exam.date)));
    setCalendarDate(selectedDate);
    setSelectedTime(exam.hour);
  };

  useEffect(() => {
    const generatedExams = generateExams();
    setExams(generatedExams);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] w-auto bg-gray-1 flex p-5 space-y-5">
      <div className="bg-blue-1 w-full h-full p-2 flex flex-col">
        <div className="w-full h-[25vh] p-2">
          <h1 className="text-4xl font-sans text-white pl-5 pb-2">
            Modify an unconfirmed exam
          </h1>
          <div className="w-full h-2/3 overflow-scroll overflow-x-hidden flex flex-col space-y-2 pl-2">
            {exams.map((exam, index) => (
              <div
                key={index}
                className={`flex flex-row items-center ${
                  selectedExamIndex === index ? "bg-orange-1" : "bg-gray-1"
                } justify-between px-5 hover:bg-orange-1 `}
                onClick={() => SelectExam(exam, index)}
              >
                <h1 className="text-3xl font-sans text-black w-fit text-left min-w-32">
                  {exam.exam}
                </h1>
                <h1 className="text-3xl font-sans text-black w-auto text-center">
                  {exam.date}
                </h1>
                <h1 className="text-3xl font-sans text-black w-fit text-right min-w-32">
                  {exam.teacher}
                </h1>
              </div>
            ))}
          </div>
        </div>
        <hr className="w-full p-1"></hr>
        <h1 className="text-xl font-sans text-white pl-5 pb-2 ml-auto mr-auto">
          Select date and time
        </h1>
        <div className="w-full h-1/2 flex">
          <div className="flex-1 w-full h-full justify-items-center">
            <div className="bg-gray-1 w-fit h-fit max-h-[290px]">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={calendarDate}
                  showDaysOutsideCurrentMonth
                  fixedWeekNumber={6}
                  views={["day"]}
                  onChange={(date) => handleDayClick(date)}
                  sx={{
                    width: "85%",
                    maxWidth: "300px",
                    ".MuiDayCalendar-root": { fontSize: "0.7rem" },
                    ".MuiPickersDay-root": { width: "28px", height: "28px" },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="h-full border-r-2 border-gray-1"></div>
          <div className="flex-1  w-full h-full justify-items-center ">
            <h1 className="text-xl font-sans text-white pt-20">{examDate}</h1>
            <div className="pt-10">
              <select
                value={selectedTime}
                onChange={handleTimeChange}
                className="w-52 h-10 rounded-sm"
              >
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center w-full space-x-8 pt-2">
          <button
            className="bg-blue-1 w-32 h-10 text-orange-1 border-orange-1 border-2 rounded-full"
            onClick={handleResetClick}
          >
            Reset
          </button>
          <button
            className="bg-orange-1 w-32 h-10 rounded-full"
            onClick={handleEditClick}
          >
            Edit
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditExams;
