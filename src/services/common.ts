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
        return dateValue.format('MM/DD/YYYY');
    } else {
        console.error('Invalid date value:', params.value);
        return 'Invalid date';
    }
};
