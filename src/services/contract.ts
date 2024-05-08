// services/sellerService.ts
import axios from 'axios';


// Set the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Instance of axios with base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL
});

interface Contract {
    id: string;
}

interface ApiResponse<T> {
    data: T[];
}

export const createContract = async (sellerData: any): Promise<any> => {
    try {
        const response = await apiClient.post<Contract>('/contract', { ...sellerData, type: 'CREATE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getContract = async (id: string): Promise<Contract> => {
    try {
        const response = await apiClient.get<Contract>(`/contract/${id}`);
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const updateContract = async (id: string, sellerData: Contract): Promise<Contract> => {
    try {
        const response = await apiClient.put<Contract>(`/contract/${id}`, sellerData);
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const deleteContract = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/contract/${id}`);
    } catch (err: unknown) {
        throw err;
    }
};

export const getAllContracts = async (): Promise<ApiResponse<Contract>> => {
    try {
        const response = await apiClient.post<ApiResponse<Contract>>('/contract', { type: 'LIST' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};
