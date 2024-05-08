import * as yup from 'yup';




const contractSchema = yup.object().shape({
    contract_no: yup.string().required('Contract no is required'),
});

export default contractSchema;
