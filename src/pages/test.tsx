import React from "react";
import { Button, TextField, Autocomplete, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';



const validationSchema = yup.object().shape({
    emails: yup.array().required('Emails are required').of(yup.string().email('Invalid email format').required('Email is required')),
    name: yup.string().required('Name is required')
});


export default function Index() {

const handleSubmit = async (values: any) => {
    console.log(values);
  };

    const formik = useFormik({
        initialValues: {
            emails: [],
            name: '',
            manish: ''
        },        
        onSubmit: handleSubmit        
    });

    return (      
            <form onSubmit={formik.handleSubmit}>
                <Autocomplete
                        multiple
                        id="emails"
                        options={['test@gmail.com', 'test1@gmail.com', 'test2@gmail.com']}
                        freeSolo
                        fullWidth
                        value={formik.values.emails}
                        onChange={(event, newValue) => {formik.setFieldValue('emails', newValue)}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                name="emails"
                                label="Enter multiple emails"
                                variant="outlined"
                                fullWidth
                                error={formik.touched.emails && Boolean(formik.errors.emails)}
                                helperText={formik.touched.emails && formik.errors.emails}
                            />
                        )}
                />
                <TextField id="outlined-basic" label="Outlined" variant="outlined" name="name" value={formik.values.name} onChange={formik.handleChange} />   
                <TextField id="outlined-basic" label="Outlined" variant="outlined" name="manish" value={formik.values.manish} onChange={formik.handleChange} />   
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </form>               
    );
}


