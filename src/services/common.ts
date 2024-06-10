import moment from 'moment';
import { getTemplate } from './template';
import { getContract } from './contract';

export const getUserData = (): { [key: string]: any } => {
    const userDataString = localStorage.getItem('userData');

    if (userDataString) {
        return JSON.parse(userDataString);
    } else {
        return {};
    }
};

export const customDateFormatter = (params: any): string => {
    const dateValue = moment(params.value);
    if (dateValue.isValid()) {
        return dateValue.format('DD/MM/YYYY');
    } else {
        console.error('Invalid date value:', params.value);
        return 'Invalid date';
    }
};

export const customFormatDate = (date: Date): string => {

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const getCurrentFinancialYear = (isDashed: boolean = false): string => {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-indexed (January is 0, December is 11)
    const currentYear = today.getFullYear();

    // Financial year starts from April (month index 3)
    const financialYearStartMonth = 3;
    const financialYearStartYear = currentMonth >= financialYearStartMonth ? currentYear : currentYear - 1;

    const financialYearEndYear = financialYearStartYear + 1;

    let formattedStart, formattedEnd;

    if (!isDashed) {
        formattedStart = `01/04/${financialYearStartYear}`;
        formattedEnd = `03/31/${financialYearEndYear}`;
        return `${formattedStart} - ${formattedEnd}`;
    } else {
        formattedStart = `${financialYearStartYear}`;
        formattedEnd = `${financialYearEndYear}`;
        return `${formattedStart}-${formattedEnd}`;
    }

};

export const incrementContractNo = (inputString: string, currentFinancialYear: string): string => {

    if (!inputString) {
        inputString = "S&F/L/0000/";
    }

    const regex = /\/(\d+)\//;
    const match = inputString.match(regex);

    if (match && match[1]) {
        const numericPart: string = match[1];
        const incrementedValue: number = parseInt(numericPart) + 1;
        const numericLength: number = numericPart.length;
        const incrementedString: string = String(incrementedValue).padStart(numericLength, '0');
        const resultString: string = inputString.replace(regex, `/${incrementedString}/`);

        // Replace the last part with the current financial year
        const lastIndex = resultString.lastIndexOf('/');
        const finalString = resultString.substring(0, lastIndex + 1) + currentFinancialYear;

        return finalString;
    } else {
        throw new Error("Numeric portion not found in the input string.");
    }
}


export const generateContractNumber = (): string => {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Generate a random 4-digit number between 1000 and 9999
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;

    return `${randomNumber}/${getCurrentFinancialYear()}`;
};


export const setLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorage = <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    if (item) {
        return JSON.parse(item) as T;
    }
    return null;
};

export function removeBackslash(input: string): string {
    if (input && input.trim() !== '') {
        return input.replace(/\//g, '');
    } else {
        return input;
    }
}
