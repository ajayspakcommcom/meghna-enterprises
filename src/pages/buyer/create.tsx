import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container, Autocomplete } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Buyer from "../../../models/Buyer";
import { useFormik } from "formik";
import ErrorMessage from "../../../components/error-message";
import buyerSchema from "@/validation/buyerSchema";
import { createBuyer } from "@/services/buyer";

const Header = dynamic(() => import('../../../components/header/index'));
const SuccessConfirmationDialogue = dynamic(() => import('../../../components/success-confirmation/index'));



export default function Index() {

  const router = useRouter();

  const [authData, setAuthData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<any>();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);


  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }

  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  const initialValues: Buyer = {
    name: '',
    address: '',
    telephone_no: '',
    mobile_no: '',
    fax: '',
    pan: '',
    gstin: '',
    state_code: '',
    email: '',
    emails: [],
    account_detail: '',
  };

  const handleSubmit = async (buyer: Buyer) => {

    setLoading(true);

    if (Array.isArray(buyer.emails) && buyer.emails.length > 0) {
      buyer.email = buyer.emails.join(', ');
    } else {
      buyer.email = '-----';
    }

    try {
      const response = await createBuyer(buyer);
      setLoading(false);
      formik.resetForm();
      setIsSuccessDialogOpen(true);
    } catch (error: any) {
      setLoading(false);
      console.error('Error saving:', error);
      setError(error);
    }

  };

  const handleReset = () => {
    formik.setValues(initialValues);
    formik.setErrors({});
  };

  const formik = useFormik({
    initialValues,
    validationSchema: buyerSchema,
    onSubmit: handleSubmit,
    onReset: handleReset
  });

  return (
    <>
      <Header />

      <Container maxWidth="xl">
        <div className='buyer-seller-form-wrapper'>

          <div>
            <div className="header-content">
              <div>
                <Typography variant="h5" component="article">Create Buyer</Typography>
              </div>
              <div className="btn-wrapper">
                <Button variant="outlined" onClick={() => goToPage('/buyer')}>Back</Button>
              </div>
            </div>
          </div>

          <div>
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
                  </div>


                  <div className="buyer-seller-forms-wrapper">

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

                  </div>


                  <div className="buyer-seller-forms-wrapper">

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

                  </div>



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



                  {/* <TextField
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
                      /> */}

                  <div className="autocomplete-email">
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

                  <TextField
                    type="text"
                    label="Account Detail"
                    name="account_detail"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={formik.values.account_detail}
                    onChange={formik.handleChange}
                    error={formik.touched.account_detail && Boolean(formik.errors.account_detail)}
                    helperText={formik.touched.account_detail && formik.errors.account_detail}
                  />


                  <Button type='submit' variant="contained" fullWidth>{loading ? "Submit..." : "Submit"}</Button>
                </form>


              </CardContent>
            </Card>
          </div>

        </div>
      </Container>

      <SuccessConfirmationDialogue isOpen={isSuccessDialogOpen} heading="Buyer Created Successfully" redirect="buyer" />


    </>
  );
}


