import * as yup from 'yup';




const contractSchema = yup.object().shape({
    contract_no: yup.string().required('Contract no is required'),
    quantity: yup.string().required('Quantity no is required'),
    price: yup.string().required('Price no is required'),
});

export default contractSchema;



