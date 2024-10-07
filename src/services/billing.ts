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

export const createBilling = async (billingData: any): Promise<any> => {
    try {
        const response = await apiClient.post<Seller>('/billing', { ...billingData, type: 'CREATE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getBillingIdName = async (): Promise<ApiResponse<Seller>> => {
    try {
        const response = await apiClient.post<ApiResponse<Seller>>('/billing', { type: 'ID-NAME' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getBilling = async (id: string): Promise<Seller> => {
    try {
        const response = await apiClient.post<Seller>('/billing', { id: id, type: 'DETAIL' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};


export const updateBilling = async (billingData: any): Promise<Seller> => {
    try {
        const response = await apiClient.post<Seller>(`/billing`, { type: 'UPDATE', ...billingData });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const deleteBilling = async (id: string): Promise<Seller> => {
    try {
        const response = await apiClient.post<Seller>('/billing', { id: id, type: 'DELETE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getAllBilling = async (): Promise<ApiResponse<Seller>> => {
    try {
        const response = await apiClient.post<ApiResponse<Seller>>('/billing', { type: 'LIST' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

