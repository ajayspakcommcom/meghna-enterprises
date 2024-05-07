import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Seller from "../../../models/Seller";
import { useFormik } from "formik";
import ErrorMessage from "../../../components/error-message";
import sellerSchema from "@/validation/sellerSchema";

const Header = dynamic(() => import('../../../components/header/index'));



export default function Index() {

  const router = useRouter();

  const [authData, setAuthData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<any>();


  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }

  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  const initialValues: Seller = {
    name: '',
    address: '',
    telephone_no: '',
    mobile_no: '',
    fax: '',
    pan: '',
    gstin: '',
    state_code: '',
    email: ''
  };

  const handleSubmit = async (seller: Seller) => {
    console.log('Seller', seller);
  };

  const handleReset = () => {
    formik.setValues(initialValues); // Reset form values to initial state
    formik.setErrors({}); // Clear any form errors
  };

  const formik = useFormik({
    initialValues,
    validationSchema: sellerSchema,
    onSubmit: handleSubmit,
    onReset: handleReset
  });

  return (
    <>
      <Header />

      <div className="header-content">
        <div>
          <Typography variant="h5" component="article">Create Seller</Typography>
        </div>
        <div className="btn-wrapper">
          <Button variant="outlined" onClick={() => goToPage('/seller')}>Back</Button>
        </div>
      </div>

      <div className='buyer-seller-form-wrapper'>
        <Card>
          <CardContent>


            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className='form'>

              {errors && <div className="error"><ErrorMessage message={errors} /></div>}

              <div className="buyer-seller-forms-wrapper">
                <div>
                  <TextField
                    type="text"
                    label="Name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </div>
                <div>

                  <TextField
                    type="text"
                    label="Email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </div>
              </div>


              <div className="buyer-seller-forms-wrapper">
                <div>
                  <TextField
                    type="text"
                    label="Telephone No"
                    name="telephone_no"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values.telephone_no}
                    onChange={formik.handleChange}
                    error={formik.touched.telephone_no && Boolean(formik.errors.telephone_no)}
                    helperText={formik.touched.telephone_no && formik.errors.telephone_no}
                  />
                </div>
                <div>
                  <TextField
                    type="text"
                    label="Mobile No"
                    name="mobile_no"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values.mobile_no}
                    onChange={formik.handleChange}
                    error={formik.touched.mobile_no && Boolean(formik.errors.mobile_no)}
                    helperText={formik.touched.mobile_no && formik.errors.mobile_no}
                  />
                </div>
              </div>


              <div className="buyer-seller-forms-wrapper">
                <div>
                  <TextField
                    type="text"
                    label="Fax"
                    name="fax"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values.fax}
                    onChange={formik.handleChange}
                    error={formik.touched.fax && Boolean(formik.errors.fax)}
                    helperText={formik.touched.fax && formik.errors.fax}
                  />
                </div>
                <div>
                  <TextField
                    type="text"
                    label="Pan"
                    name="pan"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values.pan}
                    onChange={formik.handleChange}
                    error={formik.touched.pan && Boolean(formik.errors.pan)}
                    helperText={formik.touched.pan && formik.errors.pan}
                  />
                </div>
              </div>



              <div className="buyer-seller-forms-wrapper">
                <div>
                  <TextField
                    type="text"
                    label="gstin"
                    name="gstin"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values.gstin}
                    onChange={formik.handleChange}
                    error={formik.touched.gstin && Boolean(formik.errors.gstin)}
                    helperText={formik.touched.gstin && formik.errors.gstin}
                  />
                </div>
                <div>
                  <TextField
                    type="text"
                    label="State Code"
                    name="state_code"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values.state_code}
                    onChange={formik.handleChange}
                    error={formik.touched.state_code && Boolean(formik.errors.state_code)}
                    helperText={formik.touched.state_code && formik.errors.state_code}
                  />
                </div>
              </div>

              <TextField
                type="text"
                label="Address"
                name="address"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />


              <Button type='submit' variant="contained" fullWidth>{loading ? "Login.." : "Login"}</Button>
            </form>


          </CardContent>
        </Card>
      </div>


    </>
  );
}


