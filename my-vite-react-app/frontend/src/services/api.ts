import axios from 'axios';

const API_BASE_URL = '/api/appeals';

// Function to get appeal configuration
export const getAppealConfig = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/config`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching appeal configuration: ' + error.message);
    }
};

// Function to submit a new appeal
export const submitAppeal = async (formData: FormData, token: string) => {
    try {
        const response = await axios.post(API_BASE_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error submitting appeal: ' + error.message);
    }
};

// Function to fetch the status of submitted appeals
export const fetchAppealStatus = async (token: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/status`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching appeal status: ' + error.message);
    }
};