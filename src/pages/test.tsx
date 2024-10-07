import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container, Autocomplete } from '@mui/material';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as yup from 'yup';



const validationSchema = yup.object().shape({
    emails: yup.array()
        .required('Emails are required')
        .of(yup.string().email('Invalid email format').required('Email is required')),
});


export default function Index() {

    const formik = useFormik({
        initialValues: {
            emails: [],
        },
        validationSchema,
        onSubmit: (values) => {            
            // Handle form submission logic here
        },
    });


    return (
        <>

            <br />
            <br />

            <form onSubmit={formik.handleSubmit}>
                <Autocomplete
                    multiple
                    id="emails"
                    options={[]} // options array is empty as we are allowing free-form input
                    freeSolo
                    fullWidth
                    value={formik.values.emails}
                    onChange={(event, newValue) => {
                        formik.setFieldValue('emails', newValue);
                    }}
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

                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </form>

        </>
    );
}


