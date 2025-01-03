import * as yup from 'yup';




const contractSchema = yup.object().shape({
    quantity: yup.string().required('Quantity no is required'),
    price: yup.string().required('Price no is required'),
    createdDate: yup.string().required('Date is required')
});

export default contractSchema;



