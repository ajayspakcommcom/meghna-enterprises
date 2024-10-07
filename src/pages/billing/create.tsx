import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container, Autocomplete } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Billing from "../../../models/Billing";
import { useFormik } from "formik";
import ErrorMessage from "../../../components/error-message";
import { createBilling, getContractIdName } from "@/services/billing";
import billingSchema from "@/validation/billingSchema";
import { getContractBuyerSellerDetail } from "@/services/contract";
import Contract from "../../../models/Contract";


const Header = dynamic(() => import('../../../components/header/index'));
const SuccessConfirmationDialogue = dynamic(() => import('../../../components/success-confirmation/index'));

interface selectedAutoField {
  _id: string;
  label: string;  
}

export default function Index() {

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<any>();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);  

  const [contractList, setContractList] = useState<selectedAutoField[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);


  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }

  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

const initialValues: Billing = {
    _id: '',
    contract_no: '',
    buyer_id: {
      _id: '',
      name: '',
      address: '',
      telephone_no: '',
      mobile_no: '',
      fax: '',
      pan: '',
      gstin: '',
      state_code: '',
      email: '',
      updatedDate: null,
      deletedDate: null,
      isDeleted: false,
      account_detail: '',
    createdDate: new Date(),
    __v: 0
    },
  seller_id: {
    _id: '',
    name: '',
    address: '',
    telephone_no: '',
    mobile_no: '',
    fax: '',
    pan: '',
    gstin: '',
    state_code: '',
    email: '',
    updatedDate: null,
    deletedDate: null,
    isDeleted: false,
    account_detail: '',
    createdDate: new Date(),
    __v: 0
    },
  template: {
    COMMODITY: '',
    PLACE_OF_DELIVERY: '',
    PERIOD_OF_DELIVERY: '',
    PAYMENT: '',
    TERMS_AND_CONDITIONS: '',
    BROKERAGE: '',
    BROKERAGE_LIABILITY: '',
    },
    label: {},
    quantity: 0,
    price: '',
    assessment_year: '',
    template_id: '',
    updatedDate: null,
    deletedDate: null,
    isDeleted: false,
    company: '',
    createdDate: new Date(),
    __v: 0
};

  const handleSubmit = async (billing: Billing) => {

    setLoading(true);
    try {
      await createBilling(billing);
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
    validationSchema: billingSchema,
    onSubmit: handleSubmit,
    onReset: handleReset
  });

  const fetchContractIdName = async () => {
    try {
      const response = await getContractIdName();  
      console.log(response);
      const formattedData = response.data.map((contract: any) => {        
        return {
          ...contract,
          label: contract.contract_no
        }; 
      });      
      setContractList(formattedData);
    } catch (error) {
      console.error('Error fetching contract data:', error);
    }
  };

 const handleContractChange = async (event: React.ChangeEvent<{}>, value: selectedAutoField | null) => {   
   const contractId = (value as selectedAutoField)?._id;   
   if(contractId){
      const response = await getContractBuyerSellerDetail(contractId);      
     console.log(response);  
     console.log(formik.values);
     setSelectedContract(response.data as Contract);
  } else {
    console.log('No contract selected');
  }
   
  };
  
  useEffect(() => {
    fetchContractIdName();    
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <div className='buyer-seller-form-wrapper'>          
          <div>
            <div className="header-content">
              <div>
                <Typography variant="h5" component="article">Create Billing</Typography>
              </div>
              <div className="btn-wrapper">
                <Button variant="outlined" onClick={() => goToPage('/billing')}>Back</Button>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent>
                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className='form'>
                  {errors && <div className="error"><ErrorMessage message={errors} /></div>}
                  <div>
                      <Autocomplete
                        disablePortal
                        options={contractList}                        
                        renderInput={(params) => <TextField {...params} label="Select Contract" required placeholder="Select Contract" />}
                        onChange={handleContractChange}
                      />
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
                        value={'Buyer'}
                        onChange={formik.handleChange}                        
                        disabled={true}
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
                        value={'Seller'}                                           
                        disabled={true}
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
      <SuccessConfirmationDialogue isOpen={isSuccessDialogOpen} heading="Seller Created Successfully" redirect="billing" />
    </>
  );
}


