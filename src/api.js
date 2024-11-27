import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // Base URL from environment variables
});

// Create an exam
export const createExam = async (examData, token) => {
  try {
    console.log("Token sent in header:", token);
    const response = await api.post("/exams", examData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating exam:", error);
    if (error.response) {
      console.error("Server error:", error.response.data); // Server error details
    }
    throw error;
  }
};

// Fetch exam by ID
export const fetchExamById = async (id) => {
  try {
    const response = await api.get(`/exams/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`, // Use your JWT token logic
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching exam by ID:", error);
    throw error;
  }
};

// Confirm an exam
export const confirmExam = async (examData) => {
  try {
    const response = await api.post("/exams", examData, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error confirming exam:", error);
    throw error;
  }
};

// Delete an exam
export const deleteExam = async (id) => {
  try {
    const response = await api.delete(`/exams/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting exam:", error);
    throw error;
  }
};

// Fetch exams by group or subject
export const fetchExamsByGroupOrSubject = async (param) => {
  try {
    const parameter = param;
    const response = await api.get("/exams", {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
      },
      parameter,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching exams by group or subject:", error);
    throw error;
  }
};
export const fetcheExamByTeacherId = async()=>{
    try{
        const response = await api.get("exams/teacher/teacherID",{ headers:{
            Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
        },});
       return response.data;
    }catch(error){
        console.error("Error fetching exams by teacher id");
        throw error;
      }
  }