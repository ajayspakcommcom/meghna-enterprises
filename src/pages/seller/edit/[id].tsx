import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Seller from "../../../../models/Seller";
import { useFormik } from "formik";
import ErrorMessage from "../../../../components/error-message";
import buyerSchema from "@/validation/buyerSchema";
import { createBuyer, getBuyer, updateBuyer } from "@/services/buyer";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSeller, updateSeller } from "@/services/seller";

const Header = dynamic(() => import('../../../../components/header/index'));
const SuccessConfirmationDialogue = dynamic(() => import('../../../../components/success-confirmation/index'));

interface compProps {
  detail: { data: {} };
}

interface DetailData {
  _id: string;
  name: string;
  address: string;
  telephone_no: string;
  mobile_no: string;
  fax: string;
  pan: string;
  gstin: string;
  state_code: string;
  email: string;
  updatedDate: Date | null;
  deletedDate: Date | null;
  isDeleted: boolean;
  createdDate: Date;
  __v: number;
}

const Index: React.FC<compProps> = ({ detail }) => {

  const router = useRouter();

  const [detailData, setDetailData] = useState<DetailData>(detail.data as DetailData);

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

  const initialValues: Seller = {
    name: detailData.name,
    address: detailData.address,
    telephone_no: detailData.telephone_no,
    mobile_no: detailData.mobile_no,
    fax: detailData.fax,
    pan: detailData.pan,
    gstin: detailData.gstin,
    state_code: detailData.state_code,
    email: detailData.email
  };

  const handleSubmit = async (seller: Seller) => {

    console.log('Buyer', seller);
    console.log('detailData', detailData);
    const data = { ...seller, id: detailData._id! };

    setLoading(true);

    try {
      const response = await updateSeller(data);
      console.log('response', response);
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
                <Typography variant="h5" component="article">Edit Seller</Typography>
              </div>
              <div className="btn-wrapper">
                <Button variant="outlined" onClick={() => goToPage('/seller')}>Back</Button>
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


                  <Button type='submit' variant="contained" fullWidth>{loading ? "Submit..." : "Submit"}</Button>
                </form>


              </CardContent>
            </Card>
          </div>

        </div>
      </Container>

      <SuccessConfirmationDialogue isOpen={isSuccessDialogOpen} heading="Seller Updated Successfully" />

    </>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const { id } = context.query;
  const detail = await getSeller(id as string);

  return {
    props: {
      detail
    }
  };


};

