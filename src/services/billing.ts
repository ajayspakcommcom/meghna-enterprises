// services/sellerService.ts
import axios from 'axios';
//import Seller from '../../models/Seller';


// Set the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Instance of axios with base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL
});

interface Billing {
    id: string;
}

interface Contract {
    id: string;
}

interface ApiResponse<T> {
    data: T[];
}

export const createBilling = async (billingData: any): Promise<any> => {
    try {
        const response = await apiClient.post<Billing>('/billing', { ...billingData, type: 'CREATE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getContractIdName = async (): Promise<ApiResponse<Billing>> => {
    try {
        const response = await apiClient.post<ApiResponse<Contract>>('/contract', { type: 'ID-NAME' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getBilling = async (id: string): Promise<Billing> => {
    try {
        const response = await apiClient.post<Billing>('/billing', { id: id, type: 'DETAIL' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};


export const updateBilling = async (billingData: any): Promise<Billing> => {
    try {
        const response = await apiClient.post<Billing>(`/billing`, { type: 'UPDATE', ...billingData });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const deleteBilling = async (id: string): Promise<Billing> => {
    try {
        const response = await apiClient.post<Billing>('/billing', { id: id, type: 'DELETE' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getAllBilling = async (): Promise<ApiResponse<Billing>> => {
    try {
        const response = await apiClient.post<ApiResponse<Billing>>('/billing', { type: 'LIST' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const generatePdf = async (contractData: any): Promise<any> => {

    try {
        const response = await apiClient.post<Billing>('/generate-pdf-only', { ...contractData, type: 'EMAIL-SEND' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const sendContractOnEmail = async (contractData: any): Promise<any> => {
    try {
        const response = await apiClient.post<Billing>('/generate-pdf', { ...contractData, type: 'EMAIL-SEND' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getLastBilling = async (): Promise<Billing> => {
    try {
        const response = await apiClient.post<Billing>('/billing', { type: 'LAST' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};


export const getPartyList = async (): Promise<any> => {
    try {
        const response = await apiClient.post<any>('/billing', { type: 'PARTY-LIST' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};


export const getBuyerContract = async (id: string): Promise<any> => {
    try {
        const response = await apiClient.post<any>('/contract', { id: id, type: 'BUYER-CONTRACT' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

export const getSellerContract = async (id: string): Promise<any> => {
    try {
        const response = await apiClient.post<any>('/contract', { id: id, type: 'SELLER-CONTRACT' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};


export const getBillCreatedContractList = async (id: string): Promise<any> => {
    try {
        const response = await apiClient.post<any>('/billing', { partyId: id, type: 'BILL-CREATED-CONTRACT-LIST' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};

// export const convertHtmlToPdf = async (billingData: any): Promise<any> => {
//     try {
//         const response = await apiClient.post('/html-to-pdf', { ...billingData, type: 'HTML-TO-PDF' }, {
//             responseType: 'blob'
//         });

//         const url = window.URL.createObjectURL(response.data);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'generated.pdf';
//         a.click();

//         return response;
//     } catch (err: unknown) {
//         throw err;
//     }
// };

export const convertHtmlToPdf = async (billingData: any): Promise<any> => {
    try {
        const response = await apiClient.post('/html-to-pdf', { ...billingData, type: 'HTML-TO-PDF' });

        if (response.data.pdfPath) {
            window.open(`../pdf/billing.pdf`, '_blank');
        }

        return response;
    } catch (err: unknown) {
        throw err;
    }
};


export const checkBillNo = async (billingNo: string): Promise<any> => {
    try {
        const response = await apiClient.post<any>('/billing', { billingNo: billingNo, type: 'BILL-NO-CHECK' });
        return response.data;
    } catch (err: unknown) {
        throw err;
    }
};


export const sendBillOnEmail = async (billData: any): Promise<any> => {    
    try {
        const response = await apiClient.post<Billing>('/billing', { ...billData, type: 'SEND-BILLING' });
        return response;
    } catch (err: unknown) {
        throw err;
    }
};


export const getBillReport = async (): Promise<any> => {    
    try {
        const response = await apiClient.post<Billing>('/billing', {type: 'BILL-REPORT' });
        return response;
    } catch (err: unknown) {
        throw err;
    }
};

export const downBillReport = async (billData:any): Promise<any> => {    
    try {
        const response = await apiClient.post<Billing>('/billing', {data: billData, type: 'DOWNLOAD-BILL-REPORT' });
        return response;
    } catch (err: unknown) {
        throw err;
    }
};

