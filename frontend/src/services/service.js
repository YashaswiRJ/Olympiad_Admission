import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const uploadCSV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/api/upload-csv`, formData);
    return response.data;
};

export const validateAndGenerateRanking = async () => {
    const response = await axios.post(`${API_URL}/api/validate-preferences`);
    return response.data;
};

export const getProcessedData = () => {
    const data = localStorage.getItem('processedData');
    return data ? JSON.parse(data) : null;
};

export const saveProcessedData = (data) => {
    localStorage.setItem('processedData', JSON.stringify(data));
};
