// services/sellerService.ts
import axios from 'axios';
//import Seller from '../../models/Seller';


// Set the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Instance of axios with base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL
});

interface Seller {
    id: string;
}

interface ApiResponse<T> {
    data: T[];
}

export const createSeller = async (sellerData: Seller): Promise<Seller> => {
    try {
        const response = await apiClient.post<Seller>('/seller', sellerData);
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getSeller = async (id: string): Promise<Seller> => {
    try {
        const response = await apiClient.get<Seller>(`/seller/${id}`);
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const updateSeller = async (id: string, sellerData: Seller): Promise<Seller> => {
    try {
        const response = await apiClient.put<Seller>(`/seller/${id}`, sellerData);
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const deleteSeller = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/seller/${id}`);
    } catch (err: unknown) {
        throw err;
    }
};

export const getAllSellers = async (): Promise<ApiResponse<Seller>> => {
    try {
        const response = await apiClient.post<ApiResponse<Seller>>('/seller', { type: 'LIST' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};
