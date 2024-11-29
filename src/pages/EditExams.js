import React, { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";

const timeOptions = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
];

const columns = [
  { id: "exam", label: "Subject", minWidth: 200, align: "left" },
  { id: "date", label: "Date", minWidth: 200, align: "center" },
  { id: "teacher", label: "Teacher", minWidth: 200, align: "right" },
];

function createData(exam, date, teacher) {
  return { exam, date, teacher };
}

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
  for (let i = 0; i < 20; i++) {
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const notify = (text = "Success") => toast.success(text);

  useEffect(() => {
    const fetchRejectedExams = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/exams/status/rejected`);

        // Ensure response data is not empty or malformed
        if (Array.isArray(response.data) && response.data.length > 0) {
          setExams(response.data);
        } else {
          console.error("No exams found or invalid data format");
        }
      } catch (error) {
        console.error("Error fetching rejected exams:", error);
      }
    };

    fetchRejectedExams();
  }, []);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const SelectExam = (exam, index) => {
    setSelectedExam(exam);
    setSelectedExamIndex(index);
    const selectedDate = dayjs(exam.date);
    setExamDate(getDate(new Date(exam.date)));
    setCalendarDate(selectedDate);
    setSelectedTime(exam.hour);
  };


  return (
    <div className="h-[calc(100vh-64px)] w-auto bg-gray-1 flex p-5 space-y-5">
      <div className="bg-blue-1 w-full h-full p-2 flex flex-col">
        <div className="flex flex-row justify-evenly items-center">
          <div className="w-2/3 p-2 ">
            <h1 className="text-4xl font-sans text-white pb-5 text-center">
              Modify an unconfirmed exam
            </h1>
            <TableContainer className="max-h-[380px] overflow-y-auto">
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          backgroundColor: "#E5E5E5",
                          borderBottom: "2px solid #14213D",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exams.map((exam, index) => {
                    return (
                      <TableRow
                        key={exam.examId}
                        className={`cursor-pointer ${selectedExam?.examId === exam.examId ? "bg-orange-1 text-white" : "bg-white text-black"
                          }`}
                        onClick={() => SelectExam(exam)}
                      >
                        {columns.map((column) => {
                          let value;
                          if (column.id === "teacher") {
                            value = exam.teacher ? exam.teacher.name : "No Teacher";
                          } else if (column.id === "exam") {
                            value = exam.subject || exam.exam || "No Subject";
                          } else {
                            value = exam[column.id];
                          }

                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === 'date' ? dayjs(exam[column.id]).format("DD-MM-YYYY") : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={exams.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="bg-gray-1 border-t-[2px] border-blue-1"
            />
          </div>
          <div className="h-full border-r-2 border-gray-1 mx-5"></div>
          <div className="flex flex-col w-fit flex-2">
            <h1 className="text-2xl font-sans text-white pl-5 py-5 ml-auto mr-auto">
              Select date and time
            </h1>
            <div className="w-full h-1/2 flex flex-col">
              <div className=" w-full h-full justify-items-center">
                <div className="bg-gray-1 w-fit h-fit max-h-[285px]">
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
                        ".MuiPickersDay-root": {
                          width: "28px",
                          height: "28px",
                        },

                        ".Mui-selected": {
                          backgroundColor: "#E1A23B !important",
                          color: "#FFFFFF !important",
                          "&:hover": {
                            backgroundColor: "#E1A23B !important",
                          },
                        },
                        ".MuiPickersDay-root.Mui-selected.Mui-focusVisible": {
                          backgroundColor: "#E1A23B !important",
                          color: "#FFFFFF !important",
                        },
                        ".MuiPickersDay-root.Mui-selected.Mui-active": {
                          backgroundColor: "#E1A23B !important",
                          color: "#FFFFFF !important",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>

              <div className=" w-full h-full justify-items-center ">
                <h1 className="text-xl font-sans text-white pt-10">
                  {examDate}
                </h1>
                <div className="pt-10">
                  <select
                    value={selectedTime}
                    onChange={handleTimeChange}
                    className="w-52 h-10 rounded-sm bg-gray-1"
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
          </div>
        </div>
        <div className="flex flex-row justify-center w-full space-x-8 pt-4">
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