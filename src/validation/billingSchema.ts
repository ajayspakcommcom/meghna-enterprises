import * as yup from 'yup';

const phoneRegExp = /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,3}\)?[\s-]?)?[\d\s-]{3,}$/;
const mobileRegExp = /^\d{10}$/;
const panRegExp = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const gstinRegExp = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;


const billingSchema = yup.object().shape({
    billingNo: yup.string().required('Billing number is required'),
    billingDate: yup.date().required('Billing date is required').typeError('Billing date must be a valid date'),
    partyId: yup.string().required('Party is required'),
});

export default billingSchema;


