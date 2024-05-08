import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container, Autocomplete, Select } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Contract from "../../../models/Contract";
import { useFormik } from "formik";
import ErrorMessage from "../../../components/error-message";
import contractSchema from "@/validation/contractSchema";
import { getSellerIdName } from "@/services/seller";
import { getBuyerIdName } from "@/services/buyer";
import { getTemplateIdName } from "@/services/template";


const Header = dynamic(() => import('../../../components/header/index'));

interface selectedAutoField {
  label: string;
  year: number;
}

export default function Index() {

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 }
  ];


  const router = useRouter();

  const [authData, setAuthData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<any>();

  const [selectedSeller, setSelectedSeller] = useState<selectedAutoField | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<selectedAutoField | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<selectedAutoField | null>(null);

  const [sellerList, setSellerList] = useState<any[]>([]);
  const [buyerList, setBuyerList] = useState<any[]>([]);
  const [templateList, setTemplateList] = useState<any[]>([]);

  const handleSellerChange = (event: React.ChangeEvent<{}>, value: selectedAutoField | null) => {
    setSelectedSeller(value);
  };

  const handleBuyerChange = (event: React.ChangeEvent<{}>, value: selectedAutoField | null) => {
    setSelectedBuyer(value);
  };

  const handleTemplateChange = (event: React.ChangeEvent<{}>, value: selectedAutoField | null) => {
    setSelectedTemplate(value);
  };


  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }

    const fetSellerIdName = async () => {
      try {
        const response = await getSellerIdName();
        const formattedData = response.data.map((seller: any) => {
          const output = { ...seller, label: seller.name }
          delete output.name;
          return output;
        });
        setSellerList(formattedData);
      } catch (error) {
        console.error('Error fetching seller data:', error);
      }
    };

    const fetBuyerIdName = async () => {
      try {
        const response = await getBuyerIdName();
        const formattedData = response.data.map((buyer: any) => {
          const output = { ...buyer, label: buyer.name }
          delete output.name;
          return output;
        });
        setBuyerList(formattedData);
      } catch (error) {
        console.error('Error fetching buyer data:', error);
      }
    };

    const fetTemplateIdName = async () => {
      try {
        const response = await getTemplateIdName();
        const formattedData = response.data.map((buyer: any) => {
          const output = { ...buyer, label: buyer.name }
          delete output.name;
          return output;
        });
        setTemplateList(formattedData);
      } catch (error) {
        console.error('Error fetching template data:', error);
      }
    };


    fetSellerIdName();
    fetBuyerIdName();
    fetTemplateIdName();

  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  const initialValues: Contract = {
    contract_no: ''
  };

  const handleSubmit = async (contract: Contract) => {


    console.log('contract...', contract);
    console.log('Selected Seller:', selectedSeller);
    console.log('Selected Buyer:', selectedBuyer);
    console.log('Selected Template', selectedTemplate);

    //setLoading(true);
    // try {
    //   const response = await createBuyer(buyer);
    //   console.log('response', response);
    //   setLoading(false);
    //   formik.resetForm();
    // } catch (error: any) {
    //   setLoading(false);
    //   console.error('Error saving:', error);
    //   setError(error);
    // }

  };

  const handleReset = () => {
    formik.setValues(initialValues);
    formik.setErrors({});
  };

  const formik = useFormik({
    initialValues,
    validationSchema: contractSchema,
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
                <Typography variant="h5" component="article">Create Contract</Typography>
              </div>
              <div className="btn-wrapper">
                <Button variant="outlined" onClick={() => goToPage('/contract')}>Back</Button>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent>
                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className='form'>

                  {errors && <div className="error"><ErrorMessage message={errors} /></div>}

                  <div className="buyer-seller-forms-wrapper contract-form-wrapper">
                    <div>
                      <TextField
                        type="text"
                        label="Contract no"
                        name="contract_no"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.contract_no}
                        onChange={formik.handleChange}
                        error={formik.touched.contract_no && Boolean(formik.errors.contract_no)}
                        helperText={formik.touched.contract_no && formik.errors.contract_no}
                      />
                    </div>
                    <div>
                      <Autocomplete
                        disablePortal
                        options={sellerList}
                        renderInput={(params) => <TextField {...params} label="Seller" required />}
                        onChange={handleSellerChange}
                      />
                    </div>
                  </div>

                  <div className="buyer-seller-forms-wrapper contract-form-wrapper">
                    <div>
                      <Autocomplete
                        disablePortal
                        options={buyerList}
                        renderInput={(params) => <TextField {...params} label="Buyer" required />}
                        onChange={handleBuyerChange}
                      />
                    </div>
                    <div>
                      <Autocomplete
                        disablePortal
                        options={templateList}
                        renderInput={(params) => <TextField {...params} label="Template" required />}
                        onChange={handleTemplateChange}
                      />
                    </div>
                  </div>


                  <Button type='submit' variant="contained" fullWidth>{loading ? "Submit..." : "Submit"}</Button>
                </form>


              </CardContent>
            </Card>
          </div>

        </div>
      </Container>




    </>
  );
}


