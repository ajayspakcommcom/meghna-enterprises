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
    const currentMonth = today.getMonth(); //0-indexed (January is 0, December is 11)
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

export const incrementBillingNo = (input: string | null | undefined, currentFinancialYear: string): string => {
    // Check if the input is null or undefined
    if (!input) {
        return `00001/${currentFinancialYear}`;  // Return "00001" for null or undefined input
    }

    // Find the position of the first "/"
    const indexOfSlash = input.indexOf('/');

    // If "/" is found, take all characters before it; otherwise, take the whole input
    const beforeSlash = indexOfSlash !== -1 ? input.substring(0, indexOfSlash) : input;

    // Convert the extracted part to a number
    const numericValue = parseInt(beforeSlash, 10);

    // Check if the conversion to number is successful
    if (isNaN(numericValue)) {
        return `00001`;  // Return "00001" if the conversion fails
    }

    // Increment the numeric value by 1
    const incrementedValue = numericValue + 1;

    // Convert the incremented value back to a string and pad with leading zeros to ensure it is 5 characters long
    return incrementedValue.toString().padStart(5, '0') + '/' + currentFinancialYear;
}

export const incrementContractNo = (inputString: string, currentFinancialYear: string): string => {

    const appLogo = getLocalStorage('appLogo');

    if (!inputString) {

        //inputString = "S&F/L/0000/";  //logo => Seeds&Feeds
        //inputString = "MAC/L/0000/"; //bombay => Meghna Bombay Agency
        //inputString = "MA/L/0000/"; //agro => Meghna Agro Commodities 
        //inputString = "MEC/L/0000/"; //meghna => Meghna Enterprise

        switch (appLogo) {
            case 'logo':
                inputString = "S&F/L/0000/";
                break;
            case 'agro':
                inputString = "MA/L/0000/";
                break;
            case 'bombay':
                inputString = "MAC/L/0000/";
                break;
            case 'meghna':
                inputString = "MEC/L/0000/";
                break;
            default:
                break;
        }

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

        const index = finalString.indexOf("/L");

        if (index !== -1) {
            switch (appLogo) {
                case 'logo':
                    return 'S&F' + finalString.slice(index);
                case 'agro':
                    return 'MA' + finalString.slice(index);
                case 'bombay':
                    return 'MAC' + finalString.slice(index);
                case 'meghna':
                    return 'MEC' + finalString.slice(index);
                default:
                    break;
            }
        }

        return '';
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

    if (typeof window === 'undefined') {
        return null;
    }
    const item = localStorage.getItem(key);
    if (item) {
        try {
            return JSON.parse(item) as T;
        } catch (error) {
            console.error('Error parsing JSON from localStorage:', error);
            return null;
        }
    }
    return null;

    // const item = localStorage.getItem(key);
    // if (item) {
    //     return JSON.parse(item) as T;
    // }
    // return null;
};

export function removeBackslash(input: string): string {
    if (input && input.trim() !== '') {
        return input.replace(/\//g, '');
    } else {
        return input;
    }
}

export function getCompanyName(input: string): string {
    switch (input.toLowerCase()) {
        case 'meghna':
            return 'Meghna Enterprise';
        case 'bombay':
            return 'Meghna Agencies (Bombay)';
        case 'logo':
            return 'Seeds & Feeds India';
        case 'agro':
            return 'Meghna Agro Commodities';
        default:
            return 'Unknown value';
    }
}
