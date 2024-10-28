// services/sellerService.ts
import axios from 'axios';
import { getLocalStorage } from './common';


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

export const createContract = async (contractData: any): Promise<any> => {
    try {
        const response = await apiClient.post<Contract>('/contract', { ...contractData, type: 'CREATE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getContract = async (id: string): Promise<Contract> => {
    try {
        const response = await apiClient.post<Contract>('/contract', { id: id, type: 'DETAIL' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getLastContract = async (): Promise<Contract> => {
    try {
        const response = await apiClient.post<Contract>('/contract', { type: 'LAST' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const updateContract = async (contractData: Contract): Promise<Contract> => {
    try {
        const response = await apiClient.post<Contract>(`/contract`, { type: 'UPDATE', ...contractData });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};


export const deleteContract = async (id: string): Promise<Contract> => {
    try {
        const response = await apiClient.post<Contract>('/contract', { id: id, type: 'DELETE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};


export const getAllContracts = async (): Promise<ApiResponse<Contract>> => {
    try {
        const response = await apiClient.post<ApiResponse<Contract>>('/contract', { type: 'LIST', company: getLocalStorage('appLogo') });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};


export const sendContractOnEmail = async (contractData: any): Promise<any> => {
    try {
        const response = await apiClient.post<Contract>('/generate-pdf', { ...contractData, type: 'EMAIL-SEND' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const generatePdf = async (contractData: any): Promise<any> => {

    try {
        const response = await apiClient.post<Contract>('/generate-pdf-only', { ...contractData, type: 'EMAIL-SEND' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getContractBuyerSellerDetail = async (id: string): Promise<ApiResponse<Contract>> => {
    try {
        const response = await apiClient.post<ApiResponse<Contract>>('/contract', { id: id, type: 'BUYER-SELLER-DETAIL' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const checkContractNo = async (contractNo: string): Promise<any> => {
    try {
        const response = await apiClient.post<any>('/contract', { contractNo: contractNo, type: 'CONTRACT-NO-CHECK' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};