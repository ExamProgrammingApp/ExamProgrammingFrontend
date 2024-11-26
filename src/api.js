import axios from "axios";

const api = axios.create({

    baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const createExam = async (examData, token) => {
    try {
        const response = await api.post("/exams", examData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating exam:", error);
        throw error;
    }
};