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

export const createBuyer = async (sellerData: any): Promise<any> => {
    try {
        const response = await apiClient.post<Buyer>('/buyer', { ...sellerData, type: 'CREATE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getBuyer = async (id: string): Promise<Buyer> => {
    try {
        const response = await apiClient.get<Buyer>(`/buyer/${id}`);
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const updateBuyer = async (id: string, sellerData: Buyer): Promise<Buyer> => {
    try {
        const response = await apiClient.put<Buyer>(`/buyer/${id}`, sellerData);
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const deleteBuyer = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/buyer/${id}`);
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