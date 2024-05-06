import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
});

export default loginSchema;