
// Function to format a date in a readable format
export const formatDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' });
};

// Function to format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};

// Function to capitalize the first letter of a string
export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to format a phone number (simple example)
export const formatPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};
