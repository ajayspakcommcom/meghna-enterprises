import moment from 'moment';

export const getUserData = (): { [key: string]: any } => {
    const userDataString = localStorage.getItem('userData');

    if (userDataString) {
        return JSON.parse(userDataString);
    } else {
        return {};
    }
};

export const customDateFormatter = (params: any) => {
    const dateValue = moment(params.value);
    if (dateValue.isValid()) {
        return dateValue.format('DD/MM/YYYY');
    } else {
        console.error('Invalid date value:', params.value);
        return 'Invalid date';
    }
};

export const getCurrentFinancialYear = (): string => {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-indexed (January is 0, December is 11)
    const currentYear = today.getFullYear();

    // Financial year starts from April (month index 3)
    const financialYearStartMonth = 3;
    const financialYearStartYear = currentMonth >= financialYearStartMonth ? currentYear : currentYear - 1;

    const financialYearEndYear = financialYearStartYear + 1;

    return `${financialYearStartYear}-${financialYearEndYear.toString().substring(2)}`;
};

export const generateContractNumber = (): string => {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Generate a random 4-digit number between 1000 and 9999
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;

    return `${randomNumber}/${getCurrentFinancialYear()}`;
};