import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container, Autocomplete } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Billing from "../../../models/Billing";
import { useFormik } from "formik";
import ErrorMessage from "../../../components/error-message";
import { getContractIdName } from "@/services/billing";
import billingSchema from "@/validation/billingSchema";
import { getContractBuyerSellerDetail } from "@/services/contract";
import { number } from "yup";

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
  const [selectedContract, setSelectedContract] = useState<Billing | null>(null);
  const [selectedBrokerage, setSelectedBrokerage] = useState<number>(0);


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
  __v: 0,
  brokerageAmount: 0,
  totalPurchasedAmount: 0,
  brockerage: 0,
  igst: 0,
  cgst: 0,
  sgst: 0,
  grandTotal: 0
};

  const handleSubmit = async (billing: Billing) => {
    console.log(billing);
    // setLoading(true);
    // try {
    //   await createBilling(billing);
    //   setLoading(false);
    //   formik.resetForm();
    //   setIsSuccessDialogOpen(true);
    // } catch (error: any) {
    //   setLoading(false);      
    //   setError(error);
    // }
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
     const contract = response.data as unknown as Billing;          
     const totalPurchasedAmount = (Number(contract.quantity) * Number(contract.price));     
     setSelectedContract(contract as unknown as Billing);
     formik.setFieldValue('totalPurchasedAmount', totalPurchasedAmount);
  } else {
    console.log('No contract selected');
  } 
 };
  
  const updateGrandTotal = React.useCallback(() => {
    const igst = Number(formik.values.igst);
    const cgst = Number(formik.values.cgst);
    const sgst = Number(formik.values.sgst);
    const grandTotal = selectedBrokerage * (igst / 100) + selectedBrokerage * (cgst / 100) + selectedBrokerage * (sgst / 100);
    formik.setFieldValue('grandTotal',  parseInt(grandTotal.toFixed(2)));
  }, [selectedBrokerage, formik.values.igst, formik.values.cgst, formik.values.sgst]);
  
  const brockerageHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const brockerage = Number(event.target.value);    
    const brokerageAmount = Number(selectedContract?.quantity) * Number(brockerage);
    formik.setFieldValue('brokerageAmount', brokerageAmount);
    formik.setFieldValue('brockerage', brockerage);
    setSelectedBrokerage(brokerageAmount)
  };

  const igstHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
    formik.setFieldValue('igst', event.target.value);    
    const grandTotal = selectedBrokerage * (Number(event.target.value) / 100);    
    setSelectedBrokerage((prevSelectedBrokerage) => prevSelectedBrokerage + grandTotal);
    formik.setFieldValue('grandTotal', selectedBrokerage);
  };

  const cgstHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
    formik.setFieldValue('cgst', event.target.value);        
    const grandTotal = selectedBrokerage * (Number(event.target.value) / 100);    
    setSelectedBrokerage((prevSelectedBrokerage) => prevSelectedBrokerage + grandTotal);
    formik.setFieldValue('grandTotal', selectedBrokerage);
  };

   const sgstHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
    formik.setFieldValue('sgst', event.target.value);         
    const grandTotal = selectedBrokerage * (Number(event.target.value) / 100); 
    setSelectedBrokerage((prevSelectedBrokerage) => prevSelectedBrokerage + grandTotal); 
    formik.setFieldValue('grandTotal', selectedBrokerage);
  };
  
  useEffect(() => {
    fetchContractIdName();  
    updateGrandTotal();
  }, [updateGrandTotal]);

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

                  {selectedContract &&
                    <>
                    <div className="buyer-seller-forms-wrapper">
                    <div>
                      <TextField
                        type="text"
                        label="Buyer"
                        name="buyer"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={selectedContract?.buyer_id?.name ?? ''} 
                        disabled={true}
                      />
                    </div>

                    <div>
                       <TextField
                        type="text"
                        label="Seller"
                        name="seller"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={selectedContract?.seller_id?.name ?? ''}                                           
                        disabled={true}
                      />
                    </div>
                    </div>

                    <div className="buyer-seller-forms-wrapper">
                    <div>
                      <TextField
                        type="text"
                        label="Quantity"
                        name="quantity"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={selectedContract?.quantity ?? ''} 
                        disabled={true}
                      />
                    </div>

                    <div>
                       <TextField
                        type="text"
                        label="Price"
                        name="price"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={selectedContract?.price ?? ''}                                           
                        disabled={true}
                      />
                    </div>
                    </div>

                    <div className="buyer-seller-forms-wrapper">
                    <div>
                      <TextField
                        type="text"
                        label="Total Purchased Amount"
                        name="totalPurchasedAmount"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.totalPurchasedAmount} 
                        disabled={true}
                      />
                    </div>
                    <div>
                      <TextField
                        type="text"
                        label="Brokerage"
                        name="brockerage"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.brockerage}        
                        onChange={brockerageHandleChange}
                      />
                    </div>
                    </div>

                    <div className="buyer-seller-forms-wrapper">
                    <div>
                      <TextField
                        type="text"
                        label="Brokerage Amount"
                        name="brokerageAmount"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.brokerageAmount} 
                        disabled={true}
                      />
                    </div>   
                    <div>
                      <TextField
                        type="text"
                        label="IGST"
                        name="igst"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.igst}    
                        onChange={igstHandleChange}
                      />
                    </div>   
                    </div>

                    <div className="buyer-seller-forms-wrapper">
                    <div>
                      <TextField
                        type="text"
                        label="CGST"
                        name="cgst"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.cgst}                         
                        onChange={cgstHandleChange}
                      />
                    </div>   
                    <div>
                      <TextField
                        type="text"
                        label="SGST"
                        name="sgst"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.sgst}                         
                        onChange={sgstHandleChange}
                      />
                    </div>   
                    </div>

                    <div>
                        <TextField
                          type="text"
                          label="Grand Total"
                          name="grandTotal"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={formik.values.grandTotal}
                          disabled={true}
                        />
                    </div>
                    </>
                  }
                  
                
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


