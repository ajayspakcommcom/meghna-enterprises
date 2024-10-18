import React, { useState, useEffect } from "react";
import {Card,CardContent,Button,Typography, TextField, Container, Autocomplete} from "@mui/material";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Billing from "../../../models/Billing";
import { useFormik } from "formik";
import billingSchema from "@/validation/billingSchema";

const Header = dynamic(() => import("../../../components/header/index"));



export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  const initialValues: Billing = {
    billingNo: '',  
    billingDate: null,    
  };

  const handleSubmit = async (billing: Billing) => {  
    console.log(billing);
  };

  const handleReset = () => {
    formik.setValues(initialValues);
    formik.setErrors({});
  };

  const formik = useFormik({
    initialValues,
    validationSchema: billingSchema,
    onSubmit: handleSubmit,
    onReset: handleReset,
  });


  useEffect(() => {
     
  }, []);

  return (
    <>
      <Header />

      <Container maxWidth="xl">
        <div className="buyer-seller-form-wrapper">
          <div>
            <div className="header-content">
              <div>
                <Typography variant="h5" component="article">
                  Create Billing
                </Typography>
              </div>
              <div className="btn-wrapper">
                <Button variant="outlined" onClick={() => goToPage("/billing")}>
                  Back
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent>
                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className="form">

                  <div className="buyer-seller-forms-wrapper">
                        <div>
                          <TextField
                            type="text"
                            label="Billing No"
                            name="billingNo"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formik.values.billingNo}                          
                            onChange={formik.handleChange}
                            error={formik.touched.billingNo && Boolean(formik.errors.billingNo)}
                            helperText={formik.touched.billingNo && formik.errors.billingNo}
                          />
                        </div>

                        <div>
                          <TextField
                            type="date"
                            label="Billing Date"
                            name="billingDate"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink: true }}
                            value={formik.values.billingDate}
                            onChange={formik.handleChange}
                             onBlur={formik.handleBlur}
                            error={formik.touched.billingDate && Boolean(formik.errors.billingDate)}
                            helperText={formik.touched.billingDate && formik.errors.billingDate}
                          />
                        </div>
                      </div>

                  <div className="btn-wrapper">
                    <Button type="submit" variant="contained" fullWidth>{"Submit"}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>      
    </>
  );
}
