import axios from "axios";

const api = axios.create({

    baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const createExam = async (examData, token) => {
    try {
        console.log("Token trimis în header:", token); 
        const response = await api.post("/exams", examData, {
          headers: {
                Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating exam:", error);
        if (error.response) {
            console.error("Server error:", error.response.data); // Detalii despre eroarea de la server
          }
        throw error;
    }
};