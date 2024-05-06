import axios from 'axios';
import User from '../../models/User';


// Set the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Instance of axios with base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL
});

export const authUser = async (userData: User): Promise<any> => {
    try {
        const response = await apiClient.post<User>('/auth', userData);
        return response;
    } catch (err: unknown) {
        // console.error('Error creating user:', err);
        // Handle or transform the error as needed
        // For instance, throw a custom error or return a specific error response
        throw err; // or return a specific error object/response
    }
};



