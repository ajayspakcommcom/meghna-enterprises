// services/sellerService.ts
import axios from 'axios';


// Set the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Instance of axios with base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL
});

interface Template {
    id: string;
}

interface ApiResponse<T> {
    data: T[];
}

export const createTemplate = async (sellerData: any): Promise<any> => {
    try {
        const response = await apiClient.post<Template>('/template', { ...sellerData, type: 'CREATE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getTemplateIdName = async (): Promise<ApiResponse<Template>> => {
    try {
        const response = await apiClient.post<ApiResponse<Template>>('/template', { type: 'ID-NAME' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getTemplate = async (id: string): Promise<ApiResponse<Template>> => {
    try {
        const response = await apiClient.post<ApiResponse<Template>>('/template', { id: id, type: 'DETAIL' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const updateTemplate = async (templateData: any): Promise<Template> => {
    try {
        const response = await apiClient.post<Template>(`/template`, { type: 'UPDATE', ...templateData });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const deleteTemplate = async (id: string): Promise<Template> => {
    try {
        const response = await apiClient.post<Template>('/template', { id: id, type: 'DELETE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getAllTemplates = async (): Promise<ApiResponse<Template>> => {
    try {
        const response = await apiClient.post<ApiResponse<Template>>('/template', { type: 'LIST' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};
