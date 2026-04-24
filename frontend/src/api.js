import axios from 'axios';

// This tells React exactly where your backend is running
const API = axios.create({
    baseURL: 'http://localhost:5000/api', 
});

// This is the function we will call to send the photo
export const analyzeMealAPI = (formData) => API.post('/analyze-meal', formData);
export const getDailyProgressAPI = (userId) => API.get(`/daily-stats/${userId}`);