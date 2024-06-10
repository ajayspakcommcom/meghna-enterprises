import * as yup from 'yup';

const phoneRegExp = /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,3}\)?[\s-]?)?[\d\s-]{3,}$/;
const mobileRegExp = /^\d{10}$/;
const panRegExp = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const gstinRegExp = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;


const buyerSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    address: yup.string().required('Address is required'),
    telephone_no: yup.string().matches(phoneRegExp, 'Telephone is not valid').required('Telephone no is required'),
    mobile_no: yup.string().matches(mobileRegExp, 'Mobile number is not valid').required('Mobile is required'),
    fax: yup.string().required('Fax is required'),
    pan: yup.string().matches(panRegExp, 'PAN must be in format: AAAAA9999A').required('Pan is required'),
    gstin: yup.string().matches(gstinRegExp, 'GSTIN must be a valid 15-character alphanumeric code').required('GSTIN is required'),
    state_code: yup.string().required('State code is required'),
    email: yup.string().required('Email is required').email('Invalid email format'),
    account_detail: yup.string().required('Account Detail is required')
});

export default buyerSchema;
