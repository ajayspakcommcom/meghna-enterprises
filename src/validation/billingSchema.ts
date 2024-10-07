import * as yup from 'yup';

const phoneRegExp = /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,3}\)?[\s-]?)?[\d\s-]{3,}$/;
const mobileRegExp = /^\d{10}$/;
const panRegExp = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const gstinRegExp = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;


const billingSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    address: yup.string(),
    telephone_no: yup.string(),
    mobile_no: yup.string(),
    fax: yup.string(),
    pan: yup.string().matches(panRegExp, 'PAN must be in format: AAAAA9999A').required('Pan is required'),
    gstin: yup.string(),
    state_code: yup.string(),
    email: yup.string(),
    emails: yup.array().required('Emails are required').of(yup.string().email('Invalid email format').required('Email is required')),
    account_detail: yup.string(),
});

export default billingSchema;


