import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const uploadCSV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/api/upload-csv`, formData);
    return response.data;
};

export const validatePreferences = async (students) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/validate-preferences`,
            { students }
        );
        return response.data;
    } catch (error) {
        console.error('Error validating preferences:', error);
        throw new Error(error.response?.data?.error || 'Failed to validate preferences');
    }
};

export const generateRankings = async (validationData) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/generate-rankings`,
            { validation_data: validationData }
        );
        return response.data;
    } catch (error) {
        console.error('Error generating rankings:', error);
        throw new Error(error.response?.data?.error || 'Failed to generate rankings');
    }
};

export const getProcessedData = () => {
    const data = localStorage.getItem('processedData');
    if (!data) return null;
    try {
        const parsedData = JSON.parse(data);
        // Check if data has expired
        if (parsedData.expiresAt && parsedData.expiresAt < Date.now()) {
            localStorage.removeItem('processedData');
            return null;
        }
        return parsedData;
    } catch (error) {
        console.error('Error parsing processed data:', error);
        return null;
    }
};

export const saveProcessedData = (data) => {
    const dataToSave = {
        ...data,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // Expires in 24 hours
    };
    localStorage.setItem('processedData', JSON.stringify(dataToSave));
};

export const saveRankingData = (data) => {
    localStorage.setItem('rankingData', JSON.stringify(data));
};

export const getRankingData = async (validationData) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/generate-rankings`,
            { validation_data: validationData }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching ranking data:', error);
        throw new Error(error.response?.data?.error || 'Failed to fetch ranking data');
    }
};
