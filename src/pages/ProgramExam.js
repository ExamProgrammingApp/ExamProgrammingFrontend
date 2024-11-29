import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import Badge from "@mui/material/Badge";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createExam } from "../api";
import axios from "axios";

const ScheduleExam = () => {
  const [formData, setFormData] = useState({
    subject: "",
    teacher: "",
    group: "",
    students: "",
    time: "08:00",
    duration: "",
    date: null,
  });


  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/teachers`);
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const notifySuccess = (text = "Success") => toast.success(text);
  const notifyFailed = (text = "Operation Failed") => toast.error(text);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change - ${name}: ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date: date }));
  };

  const handleReset = () => {
    setFormData({
      subject: "",
      teacher: "",
      group: "",
      students: "",
      time: "",
      duration: "",
      date: null,
    });
  };

  const handleAddExam = async () => {
    if (Object.values(formData).some((value) => !value)) {
      notifyFailed("All fields are required");
      return;
    }

    const examData = {
      subject: formData.subject,
      teacherId: formData.teacher,
      group: formData.group,
      numberOfStudents: parseInt(formData.students, 10),
      startTime: formData.time,
      duration: formData.duration,
      date: formData.date,
    };


    try {

      const token = localStorage.getItem("access_token");
      console.log("Token", token);
      if (!token) {
        notifyFailed("No authentication token found");
        return;
      }
      const result = await createExam(examData, token);
      console.log("Exam created successfully:", result);
      notifySuccess("Exam was successfully added");
      handleReset();
    } catch (error) {
      notifyFailed("Failed to add exam");
    }
  };

  const ServerDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;

    return (
      <Badge key={props.day.toString()} overlap="circular" badgeContent={false}>
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-1">
      {/* Main Content */}
      <div className="flex flex-col flex-1 p-8">
        <h1 className="text-5xl font-handwriting mb-5 text-gray-900">
          Schedule an exam
        </h1>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Teacher */}
            <div className="w-full">
              <label className="block text-lg font-medium text-gray-800">
                Teacher
              </label>
              <div className="flex w-full">
                {/* Select-ul */}
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  className="w-full pl-3 bg-white border-2 border-gray-400 rounded-l-lg focus:outline-none box-border h-10"
                >
                  <option value="">Select</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.teacherId} value={teacher.teacherId}>
                      {teacher.name}
                    </option>
                  ))}
                </select>

                {/* Butonul */}
                <button
                  type="button"
                  className="text-lg font-medium text-white bg-yellow-500 rounded-r-lg hover:bg-yellow-600 flex-shrink-0 h-10 min-w-52 w-1/2"
                >
                  See teacher's schedule
                </button>
              </div>
            </div>
            {/* Calendar */}
            <div>
              <label className="text-lg font-medium text-gray-800 block">
                Select a day
              </label>
              <div className="w-full h-fit bg-white rounded-3xl px-10 border-2 border-gray-400">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={formData.date}
                    views={["day"]}
                    fixedWeekNumber={6}
                    showDaysOutsideCurrentMonth={true}
                    onChange={handleDateChange}
                    slots={{ day: ServerDay }}
                    slotProps={{
                      day: {
                        sx: {
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          "&.Mui-selected": {
                            backgroundColor: "orange-1 !important",
                            color: "white !important",
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor: "darkorange !important",
                          },
                        },
                      },
                    }}
                    //className="mx-auto"
                    sx={{
                      width: "100%",
                      maxWidth: 600,
                      maxHeight: "300px",
                      margin: "0 auto",
                      ".MuiCalendarPicker-root": {
                        maxWidth: "90%",
                      },
                      ".MuiDayCalendar-weekContainer": {
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: "8px",
                        justifyItems: "center",
                      },
                      ".MuiDayCalendar-header": {
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "bold",
                        justifyItems: "center",
                      },
                      ".MuiDayCalendar-weekContainer .MuiTypography-root": {
                        fontSize: "14px",
                        textAlign: "center",
                      },
                      ".Mui-selected": {
                        backgroundColor: "#E1A23B !important",
                        color: "#FFFFFF !important",
                        "&:hover": {
                          backgroundColor: "#E1A23B !important",
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>

          {/* Right Column */}

          <div className="space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-lg font-medium text-gray-800">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="block w-full pl-3 bg-white border-2 border-gray-400 rounded-lg h-10"
              >
                <option value="">Select</option>
                <option value="math">Mathematics</option>
                <option value="physics">Physics</option>
              </select>
            </div>
            {/* Group */}
            <div>
              <label className="block text-lg font-medium text-gray-800">
                Group
              </label>
              <select
                name="group"
                value={formData.group}
                onChange={handleInputChange}
                className="block w-full bg-white border-2 pl-3 border-gray-400 rounded-lg h-10"
              >
                <option value="">Select</option>
                <option value="a1">Group A1</option>
                <option value="b1">Group B1</option>
              </select>
            </div>

            {/* Nr. of Students */}
            <div>
              <label className="block text-lg font-medium text-gray-800">
                Nr. of students
              </label>
              <input
                type="number"
                name="students"
                value={formData.students}
                onChange={handleInputChange}
                min="1"
                max="100"
                placeholder="Enter number of students"
                className="block w-full pl-3 bg-white border-2 border-gray-400 rounded-lg h-10"
              />
            </div>

            {/* Select Time */}
            <div className="flex flex-col items-start mt-8">
              <label className="text-xl leading-none text-black mb-3">
                Select time
              </label>
              <div className="w-full max-w-sm rounded-3xl">
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="block w-full pl-3 h-10 text-black text-lg bg-gray-100 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-1 focus:border-orange-1 outline-none"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-lg font-medium text-gray-800">
                Duration (in minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                placeholder="Enter duration in minutes"
                className="block w-full pl-3 bg-white border-2 border-gray-400 rounded-lg h-10"
              />
            </div>
          </div>
        </form>

        {/* Buttons */}
        <div className="flex justify-center space-x-12 pt-8">
          <button
            type="button"
            onClick={handleReset}
            className="w-48 px-6 py-3 text-lg font-semibold text-yellow-500 border-2 border-yellow-500 rounded-full"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleAddExam}
            className="w-48 px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-full hover:bg-yellow-600"
          >
            Add Exam
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ScheduleExam;