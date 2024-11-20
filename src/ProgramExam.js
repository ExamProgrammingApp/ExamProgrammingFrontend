import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import Badge from "@mui/material/Badge";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

  const handleAddExam = () => {
    if (Object.values(formData).every((value) => value)) {
      handleReset();
    }
  };

  const ServerDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={false}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-8">
        <h1 className="text-5xl font-handwriting mb-10 text-gray-900">Schedule an exam</h1>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-lg font-medium text-gray-800">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="block w-full mt-2 p-3 bg-white border-2 border-gray-400 rounded-lg"
              >
                <option value="">Select</option>
                <option value="math">Mathematics</option>
                <option value="physics">Physics</option>
              </select>
            </div>

            {/* Teacher */}
            <div className="w-full">
              <label className="block text-lg font-medium text-gray-800 mb-2">Teacher</label>
              <div className="flex w-full">
                {/* Select-ul */}
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  className="block w-full p-3 bg-white border-2 border-gray-400 rounded-l-lg focus:outline-none"
                  style={{ height: "51px", boxSizing: "border-box" }} // Lățime și înălțime corect calculate
                >
                  <option value="">Select</option>
                  <option value="smith">Dr. Smith</option>
                  <option value="jones">Prof. Jones</option>
                </select>

                {/* Butonul */}
                <button
                  type="button"
                  className="text-lg font-semibold text-white bg-yellow-500 rounded-r-lg hover:bg-yellow-600 flex-shrink-0"
                  style={{
                    height: "51px", // Aceeași înălțime
                    padding: "0 16px", // Padding ajustat pentru un aspect uniform
                    boxSizing: "border-box",
                  }}
                >
                  See teacher's schedule
                </button>
              </div>
            </div>
            {/* Calendar */}
            <div>
              <label className="text-lg font-medium text-gray-800 mb-3 block">Select a day</label>
              <div className="w-full bg-gray-1 rounded-3xl p-6">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={formData.date}
                    onChange={handleDateChange}
                    slots={{ day: ServerDay }}
                    slotProps={{
                      day: {
                        sx: {
                          width: "40px",
                          height: "40px",
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
                    className="mx-auto"
                    sx={{
                      width: "100%",
                      maxWidth: 800,
                      margin: "0 auto",
                      ".MuiCalendarPicker-root": {
                        maxWidth: "100%",
                        marginBottom: "20px",
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
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Group */}
            <div>
              <label className="block text-lg font-medium text-gray-800">Group</label>
              <select
                name="group"
                value={formData.group}
                onChange={handleInputChange}
                className="block w-full mt-2 p-3 bg-white border-2 border-gray-400 rounded-lg"
              >
                <option value="">Select</option>
                <option value="a1">Group A1</option>
                <option value="b1">Group B1</option>
              </select>
            </div>

            {/* Nr. of Students */}
            <div>
              <label className="block text-lg font-medium text-gray-800">Nr. of students</label>
              <input
                type="number"
                name="students"
                value={formData.students}
                onChange={handleInputChange}
                min="1"
                max="100"
                placeholder="Enter number of students"
                className="block w-full mt-2 p-3 bg-white border-2 border-gray-400 rounded-lg"
              />
            </div>

            {/* Select Time */}
            <div className="flex flex-col items-start mt-8">
              <label className="text-xl leading-none text-black mb-3">Select time</label>
              <div className="w-full max-w-sm bg-blue-1 rounded-3xl p-6">
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="block w-full p-4 text-black text-lg bg-gray-100 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-1 focus:border-orange-1 outline-none"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-lg font-medium text-gray-800">Duration (in minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                placeholder="Enter duration in minutes"
                className="block w-full mt-2 p-3 bg-white border-2 border-gray-400 rounded-lg"
              />
            </div>
          </div>
        </form>



        {/* Buttons */}
        <div className="mt-10 flex justify-center space-x-6">
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
    </div>
  );
};

export default ScheduleExam;
