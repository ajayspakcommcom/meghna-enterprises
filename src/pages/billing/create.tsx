import React, { useState, useEffect } from "react";
import {Card,CardContent,Button,Typography, TextField, Container, Autocomplete, FormControl, Select, InputLabel, MenuItem, FormHelperText, SelectChangeEvent, Grid, ListItem } from "@mui/material";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Billing from "../../../models/Billing";
import { useFormik } from "formik";
import billingSchema from "@/validation/billingSchema";
import { getBuyerContract, getLastBilling, getPartyList, getSellerContract } from "@/services/billing";
import { getCurrentFinancialYear, incrementBillingNo } from "@/services/common";
import { getSeller } from "@/services/seller";
import { getBuyer } from "@/services/buyer";

const Header = dynamic(() => import("../../../components/header/index"));

interface Party {
  _id: string;
  type: string;
  name: string;
}

type DataListItem = {
    _id: string;
    contract_no: string;
    seller_id: string;
    quantity: number;
    price: string;
    category: string;
    createdDate: string;    
    amount: number;
    brockerageAmt: number;
};


export default function Index() {

  const router = useRouter();
  const [partyList, setPartyList] = useState<Party[]>([]);
  const [contractDataList, setContractDataList] = useState<any>(null);
  const [netAmount, setNetAmount] = useState<number>(0);


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
    billingDate: '',
    partyId: '',
    email: '',
    mobile_no: '',
    address: '',
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

  const handlePartySelectChange = async (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    formik.handleChange(event);   
    const selectedParty = partyList.find((party: Party) => party._id === selectedValue);        
    const partyData = selectedParty?.type === 'buyer' ? await getBuyer(selectedValue) : await getSeller(selectedValue);

    formik.setFieldValue('email', ((partyData as any).data.email));
    formik.setFieldValue('mobile_no', ((partyData as any).data.mobile_no));
    formik.setFieldValue('address', ((partyData as any).data.address));

    const { data: contractData } = selectedParty?.type === 'buyer' ? await getBuyerContract(selectedValue) : await getSellerContract(selectedValue);    


    const updatedContractData = contractData.map((contract: any) => ({
      ...contract, 
      brockerageAmt: 0 
    }));

    setContractDataList(updatedContractData);
    setNetAmount(0);
  };

  const fetchLastBilling = async () => {
  try {
    const response = await getLastBilling();
    if (response && (response as any).data) {
      const billingNo = (response as any).data.billingNo;            
      formik.setFieldValue('billingNo', incrementBillingNo(billingNo, getCurrentFinancialYear(true)));
    } else {            
      formik.setFieldValue('billingNo', incrementBillingNo('', getCurrentFinancialYear(true)));
    }
  } catch (error) {
    console.log('Error fetching seller data:', error);
  }
  };
  
  const fetchPartyList = async () => {
    try {
      const response = await getPartyList();      
      setPartyList(response?.data ?? []);
    } catch (error) {
      console.log('Error fetching seller data:', error);
    }
  };

  const contractHandleInputChange = (index: number,field: keyof DataListItem, value: string | number): void => {
    const updatedDataList = [...contractDataList];
    updatedDataList[index][field] = value as never;
        
    const price = parseFloat(updatedDataList[index].brockerageAmt) || 0;  
    const quantity = updatedDataList[index].quantity || 0;   
        
    if (field === 'brockerageAmt' || field === 'quantity') {
      updatedDataList[index].amount = price * quantity;
    }

    const totalAmt = updatedDataList.reduce((total, item) => total + (item.amount || 0), 0);
    setNetAmount(totalAmt);

    setContractDataList(updatedDataList);
    };


  useEffect(() => {
    fetchLastBilling();
    fetchPartyList();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <div className="buyer-seller-form-wrapper full-width">
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
                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className="form billing-form">

                  
                  <Grid container spacing={1}>
                    <Grid item xs={3}>
                      <ListItem>
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
                            disabled={true}
                          />
                      </ListItem>
                    </Grid>
                    <Grid item xs={3}>
                      <ListItem>
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
                      </ListItem>
                    </Grid>
                    <Grid item xs={3}>
                      <ListItem>
                        <FormControl fullWidth className="party-select">
                        <InputLabel id="party-select-label">Party</InputLabel>
                          <Select
                            labelId="party-select-label"
                            id="party-select"
                            name="partyId" 
                            value={formik.values.partyId} 
                            label="Party"
                            onChange={handlePartySelectChange}
                            onBlur={formik.handleBlur} error={formik.touched.partyId && Boolean(formik.errors.partyId)}>
                            {partyList.map((party: any) => (<MenuItem key={party._id} value={party._id}>{party.name} {party.type}</MenuItem>))}                            
                          </Select>
                        </FormControl>
                        {formik.touched.partyId && formik.errors.partyId && (<FormHelperText error>{formik.errors.partyId}</FormHelperText>)}  
                      </ListItem>
                    </Grid>
                    <Grid item xs={3}>
                      <ListItem>
                        <TextField
                            type="text"
                            label="Email"
                            name="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formik.values.email}                          
                            onChange={formik.handleChange}
                            disabled={true}
                          />
                      </ListItem>

                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item xs={2}>
                      <ListItem>
                        <TextField
                            type="text"
                            label="Mobile"
                            name="mobile_no"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formik.values.mobile_no}                          
                            onChange={formik.handleChange}
                            disabled={true}
                        />
                      </ListItem>
                    </Grid>
                    <Grid item xs={10}>
                      <ListItem>
                        <TextField
                          label="Address"
                          name="address"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          disabled={true}
                          multiline  // Add this prop to make it a textarea
                          rows={2}   // Adjust the number of rows as needed
                        />
                      </ListItem>
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <ListItem>
                        <hr />
                      </ListItem>
                    </Grid>                    
                  </Grid>


                  {/* <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <ListItem>Left</ListItem>
                    </Grid>                    
                    <Grid item xs={6}>
                      <ListItem>Right</ListItem>
                    </Grid>                    
                  </Grid> */}

                  {contractDataList && contractDataList.length > 0 && contractDataList.map((contract:DataListItem, index:number) => (
                
                <div key={contract._id} className="billing-contract-form">
                <TextField
                    label="Date"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={contract.createdDate}
                    onChange={(e) => contractHandleInputChange(index, 'createdDate', e.target.value)}
                    disabled={true}    
                />

                <TextField
                    label="Contract No"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={contract.contract_no}
                    onChange={(e) => contractHandleInputChange(index, 'contract_no', e.target.value)}
                    disabled={true}    
                    />
                    
                <TextField
                    label="Category"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={contract.category}
                    onChange={(e) => contractHandleInputChange(index, 'category', e.target.value)}
                    disabled={true}    
                />

                <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={contract.quantity}
                    onChange={(e) => contractHandleInputChange(index, 'quantity', e.target.value)}
                    disabled={true}    
                />

                <TextField
                    label="Price"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={contract.price}                    
                    disabled={true}    
                      />
                      

                <TextField
                    type="number"
                    label="Brokerage"
                    fullWidth
                    margin="normal"
                    value={contract.brockerageAmt}
                    onChange={(e) => contractHandleInputChange(index, 'brockerageAmt', e.target.value)}                    
                />


                <TextField
                    label="Amount"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={contract.amount || 0}                    
                    disabled={true}   
                />
                </div>
                  ))}
                  
                  <div className="net-amount-wrapper">
                    <div>
                      <Typography variant="h6" component="article" className="label">Net Amount</Typography>
                      <Typography variant="body1" component="article" className="value">{netAmount}</Typography>
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
