// services/sellerService.ts
import axios from 'axios';
//import Seller from '../../models/Seller';


// Set the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Instance of axios with base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL
});

interface Buyer {
    id: string;
}

interface ApiResponse<T> {
    data: T[];
}

export const createBuyer = async (buyerData: any): Promise<any> => {
    try {
        const response = await apiClient.post<Buyer>('/buyer', { ...buyerData, type: 'CREATE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getBuyerIdName = async (): Promise<ApiResponse<Buyer>> => {
    try {
        const response = await apiClient.post<ApiResponse<Buyer>>('/buyer', { type: 'ID-NAME' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getBuyer = async (id: string): Promise<Buyer> => {
    try {
        const response = await apiClient.post<Buyer>('/buyer', { id: id, type: 'DETAIL' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const updateBuyer = async (buyerData: any): Promise<Buyer> => {
    try {
        const response = await apiClient.post<Buyer>(`/buyer`, { type: 'UPDATE', ...buyerData });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const deleteBuyer = async (id: string): Promise<Buyer> => {
    try {
        const response = await apiClient.post<Buyer>('/buyer', { id: id, type: 'DELETE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getAllBuyers = async (): Promise<ApiResponse<Buyer>> => {
    try {
        const response = await apiClient.post<ApiResponse<Buyer>>('/buyer', { type: 'LIST' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};
