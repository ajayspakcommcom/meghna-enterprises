import React, { useState, useEffect } from "react";
import {Card,CardContent,Button,Typography, TextField, Container, Autocomplete, FormControl, Select, InputLabel, MenuItem, FormHelperText, SelectChangeEvent, Grid, ListItem, debounce } from "@mui/material";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Billing from "../../../../models/Billing";
import { useFormik } from "formik";
import billingSchema from "@/validation/billingSchema";
import { createBilling, getBillCreatedContractList, getBilling, getBuyerContract, getLastBilling, getPartyList, getSellerContract, updateBilling } from "@/services/billing";
import { customFormatDate, debounceBillingNoCheck, getCurrentFinancialYear, incrementBillingNo } from "@/services/common";
import { getSeller } from "@/services/seller";
import { getBuyer } from "@/services/buyer";
const converter = require('number-to-words');
import { GetServerSideProps, GetServerSidePropsContext } from "next";


const Header = dynamic(() => import("../../../../components/header/index"));
const SuccessConfirmationDialogue = dynamic(() => import('../../../../components/success-confirmation/index'));


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
    brokerageQty: number;
};


export default function Index({detail}: {detail: Billing}) {

  const router = useRouter();
  const [partyList, setPartyList] = useState<Party[]>([]);
  const [contractDataList, setContractDataList] = useState<any>(null);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [sgst, setSgst] = useState<number>(0);
  const [cgst, setCgst] = useState<number>(0);
  const [igst, setIgst] = useState<number>(0);
  const [brokerageAmt, setBrokerageAmt] = useState<number>(0);
  const [grandTotalAmt, setGrandTotalAmt] = useState<number>(0);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isBillNoExists, setIsBillNoExists] = useState(false);
  const [partyListLoaded, setPartyListLoaded] = useState(false);

  const initialValues: Billing = {
    billingNo: '',  
    billingDate: '',
    partyId: '',
    email: '',
    mobile_no: '',
    address: '',
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  

  const handleSubmit = async (billing: Billing) => {  

    const contractData = contractDataList.map((contract: any) => ({
      contractId: contract.contractId,
      quantity: contract.quantity,
      price: contract.price,
      brokerageQty: contract.brokerageQty ? parseInt(contract.brokerageQty) : 0,
      brokerageAmt: contract.brokerageAmt ? contract.brokerageAmt : 0,
      category: contract.partyType,
      partyType: contract.partyType,
      contractNo: contract.contractNo,
      createdDate: contract.createdDate,
      templateName : contract.templateName,
      partyId: contract.partyId     
    }));


    const objData = {
      billingNo: billing.billingNo,
      billingDate: billing.billingDate,
      partyId: billing.partyId,
      contracts: [...contractData],
      sgst: sgst,
      cgst: cgst,
      igst: igst,
      netAmount: netAmount,
      brokerage: brokerageAmt,
      grandTotalAmt: grandTotalAmt,
      outstandingAmount: 0,
      partyType: contractData[0].category.toLowerCase() === 'seller' ? 'Seller' : 'Buyer',
      billingId: (detail as any).data._id
    }

    

    console.log('billing', billing);
    console.log('contractDataList', contractDataList);
    console.log('contractData', contractData);
    console.log('objData', objData);

    const response = await updateBilling(objData);
    console.log('response', response);
    
  
    try {
      const response = await updateBilling(objData);      
      formik.resetForm();       
      if ((response as any)?.message) {
        setIsSuccessDialogOpen(true);   
    } else {
      console.log('Error updating billing:', response);
    }
    } catch (error: any) {
      console.log('Error updating billing:', error);
    }

  };

   const successDialogCloseHandler = (val: boolean) => {      
      console.log('successDialogCloseHandler', val);
    }

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

    let updatedContractData = contractData.map((contract: any) => ({ ...contract, brockerageAmt: 0 }));
    let createdContractListResponse = (await getBillCreatedContractList(selectedValue)).data;


    createdContractListResponse.map((createdContract: any, index: number) => {
          
          const contractId = createdContract.contracts.contractId;    
          const updatedContract = updatedContractData.find((updated: any) => updated._id === contractId);
                  
          if (updatedContract) {
              const indexToRemove = updatedContractData.findIndex((updated: any) => updated._id === contractId);
                  if (indexToRemove > -1) {
                      updatedContractData.splice(indexToRemove, 1); 
                  }
              return {
                ...updatedContract,
                isBillCreated: true
              };
              }
              else {
            return {    
                    ...updatedContract,                
                      isBillCreated: false
                  };
              }
    }); 

    setContractDataList(updatedContractData);
    setNetAmount(0);
    setGrandTotalAmt(0);
    setBrokerageAmt(0);
  };

   const handlePartySelectChangeOnLoad = async (id: string) => {

    

    const selectedParty = partyList.find((party: Party) => party._id === id);        
    const partyData = selectedParty?.type === 'buyer' ? await getBuyer(id) : await getSeller(id);
    
    formik.setFieldValue('email', ((partyData as any).data.email));
    formik.setFieldValue('mobile_no', ((partyData as any).data.mobile_no));
    formik.setFieldValue('address', ((partyData as any).data.address));

    const { data: contractData } = selectedParty?.type === 'buyer' ? await getBuyerContract(id) : await getSellerContract(id);  
    let updatedContractData = contractData.map((contract: any) => ({ ...contract, brockerageAmt: 0 }));
    let createdContractListResponse = (await getBillCreatedContractList(id)).data;

    createdContractListResponse.map((createdContract: any, index: number) => {
          
          const contractId = createdContract.contracts.contractId;    
          const updatedContract = updatedContractData.find((updated: any) => updated._id === contractId);
                  
          if (updatedContract) {
              const indexToRemove = updatedContractData.findIndex((updated: any) => updated._id === contractId);
                  if (indexToRemove > -1) {
                      updatedContractData.splice(indexToRemove, 1); 
                  }
              return {
                ...updatedContract,
                isBillCreated: true
              };
              }
              else {
            return {    
                    ...updatedContract,                
                      isBillCreated: false
                  };
              }
    }); 

    //setContractDataList(updatedContractData);
    //setNetAmount(0);
    //setGrandTotalAmt(0);
    //setBrokerageAmt(0);
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
      setPartyListLoaded(true);
    } catch (error) {
      console.log('Error fetching seller data:', error);
      setPartyListLoaded(true);
    }
  };

  const contractHandleInputChange = (index: number,field: keyof DataListItem, value: string | number): void => {

    const updatedDataList = [...contractDataList];
    updatedDataList[index][field] = value as never;
        
    const price = parseFloat(updatedDataList[index].brokerageQty) || 0;  
    const quantity = updatedDataList[index].quantity || 0;   
        
    if (field === 'brokerageQty' || field === 'quantity') {
      updatedDataList[index].brokerageAmt = price * quantity;
    }

    const totalAmt = updatedDataList.reduce((total, item) => total + (item.brokerageAmt || 0), 0);
    const grossAmt = totalAmt * igst/100;

    const totalTax = cgst + sgst + igst;
    
    setNetAmount(totalAmt);
    setContractDataList(updatedDataList);
    //setBrokerageAmt(grossAmt);
    setBrokerageAmt(totalAmt * (totalTax/100));
  };
  
  const handleSgstChange = (event: SelectChangeEvent) => {    
    const value = parseInt(event.target.value);
    setSgst(value);
    
    const totalAmt = contractDataList.reduce((total: number, item: any) => total + (item.brokerageAmt || 0), 0);
    const grossAmt = totalAmt * (cgst + value + igst) / 100;
    setBrokerageAmt(grossAmt);

  };

  const handleCgstChange = (event: SelectChangeEvent) => {     
    const value = parseInt(event.target.value);
    setCgst(value);
  
    const totalAmt = contractDataList.reduce((total: number, item: any) => total + (item.brokerageAmt || 0), 0);
    const grossAmt = totalAmt * (sgst + value + igst) / 100;
    setBrokerageAmt(grossAmt);
  };

  const handleIgstChange = (event: SelectChangeEvent) => {     
    const value = parseInt(event.target.value);
    setIgst(value);    
    
    const totalAmt = contractDataList.reduce((total: number, item: any) => total + (item.brokerageAmt || 0), 0);
    const grossAmt = totalAmt * (cgst + sgst + value) / 100;
    setBrokerageAmt(grossAmt);
  };

  const handleContractRemove = (index: number) => {
    
    const updatedDataList = [...contractDataList];
    updatedDataList.splice(index, 1);
    setContractDataList(updatedDataList);

    const totalAmt = updatedDataList.reduce((total: number, item: any) => total + (item.brokerageAmt || 0), 0);
    
    setNetAmount(totalAmt);
    const totalTax = cgst + sgst + igst;
    setBrokerageAmt(2)
    setBrokerageAmt(totalAmt * (totalTax/100));

  };

  const handleBillNoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('billingNo', event.target.value);
    const billingNo = await debounceBillingNoCheck(event.target.value);    
    if (billingNo?.data) {            
      setIsBillNoExists(true);
    } else {      
      setIsBillNoExists(false);
    }
  };

  useEffect(() => {     
    setGrandTotalAmt(netAmount + brokerageAmt);
  }, [igst, netAmount, setNetAmount]);


  // useEffect(() => {
  //   fetchPartyList();
  //   formik.setFieldValue('billingNo', (detail as any).data.billingNo);
  //   formik.setFieldValue('partyId', (detail as any).data.partyId);
  //   formik.setFieldValue('billingDate', new Date((detail as any).data.billingDate).toISOString().split('T')[0]);        
  //   handlePartySelectChangeOnLoad((detail as any).data.partyId);
  // }, []);

  useEffect(() => {
    

    const loadData = async () => {
      await fetchPartyList(); 
      formik.setFieldValue('billingNo', (detail as any).data.billingNo);
      formik.setFieldValue('partyId', (detail as any).data.partyId);
      formik.setFieldValue('billingDate',new Date((detail as any).data.billingDate).toISOString().split('T')[0]);    
      
    };
  
    loadData();
  }, []);

  useEffect(() => {
    if (partyListLoaded) {      
      handlePartySelectChangeOnLoad((detail as any).data.partyId);
      setContractDataList((detail as any).data.contracts);       
      setNetAmount((detail as any).data.netAmount);
      setGrandTotalAmt((detail as any).data.grandTotalAmt);
      setBrokerageAmt((detail as any).data.brokerage);
      setCgst((detail as any).data.cgst);
      setSgst((detail as any).data.sgst)
      setIgst((detail as any).data.igst)    
    }
  }, [partyListLoaded]);

  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <div className="buyer-seller-form-wrapper full-width">
          <div>
            <div className="header-content">
              <div>
                <Typography variant="h5" component="article">
                  Edit Billing
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
                          onChange={handleBillNoChange}  
                          error={formik.touched.billingNo && Boolean(formik.errors.billingNo)}
                          helperText={ isBillNoExists && <span style={{ color: 'red' }}>Billing No already exists.</span>}
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
                        <FormControl fullWidth className="party-select" disabled={true}>
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

                  {contractDataList && contractDataList.length > 0 && (
                    <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <ListItem><hr /></ListItem>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItem>
                        <Typography variant="h6" component="article" className="label">Contract Details</Typography>
                      </ListItem>
                    </Grid>                        
                  </Grid>
                  )}

                  {contractDataList && contractDataList.length > 0 && contractDataList.map((contract: DataListItem, index: number) => (
                        <div key={contract._id} className="billing-contract-form">
                <TextField
                    label="Date"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={customFormatDate(new Date(contract.createdDate))}
                    onChange={(e) => contractHandleInputChange(index, 'createdDate', e.target.value)}
                    disabled={true}    
                />

                <TextField
                    label="Contract No"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={(contract as any).contractNo}                    
                    disabled={true}    
                    />
                    
                <TextField
                    label="Category"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={(contract as any).partyType}                    
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
                    label="Brokerage on Qty"
                    fullWidth
                    margin="normal"
                    value={(contract as any).brokerageQty || 0}
                    onChange={(e) => contractHandleInputChange(index, 'brokerageQty', e.target.value)}                    
                />


                <TextField
                    label="Amount"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={(contract as any).brokerageAmt || 0}                    
                    disabled={true}   
                      />
                      
                  <button type="button" onClick={() => handleContractRemove(index)}>x</button>

                </div>
                  ))}
                  
                  {contractDataList && contractDataList.length > 0 && (
                    <div className="net-amount-wrapper">                      
                    <div>
                      <Typography variant="h6" component="article" className="label">Net Amount : </Typography>
                      <Typography variant="body1" component="article" className="value">{netAmount}</Typography>
                    </div>
                  </div>
                  )}

                  {contractDataList && contractDataList.length > 0 &&
                    (
                    <div className="gross-amount-wrapper">
                      <div>
                      <FormControl sx={{ m: 1 }} className="billing-tax-select">
                      <InputLabel id="demo-simple-select-autowidth-label">Sgst</InputLabel>                      
                      <Select labelId="demo-simple-select-autowidth-label" id="demo-simple-select-autowidth"  onChange={handleSgstChange} autoWidth label="Sgst" value={sgst.toString()}>                                          
                          {Array.from({ length: 29 }, (_, index) => index).map((value) => (
                          <MenuItem key={value} value={value}>{value === 0 ? '0%' : `${value} ${value === 1 ? '%' : '%'}`}</MenuItem>
                        ))}
                      </Select>
                      </FormControl>
                      
                      <FormControl sx={{ m: 1 }} className="billing-tax-select">
                      <InputLabel id="demo-simple-select-autowidth-label">Cgst</InputLabel>
                      <Select labelId="demo-simple-select-autowidth-label" id="demo-simple-select-autowidth" onChange={handleCgstChange} autoWidth label="Cgst" value={cgst.toString()}>                    
                        {Array.from({ length: 29 }, (_, index) => index).map((value) => (
                          <MenuItem key={value} value={value}>{value === 0 ? '0%' : `${value} ${value === 1 ? '%' : '%'}`}</MenuItem>
                        ))}
                      </Select>
                     </FormControl>
                    
                     <FormControl sx={{ m: 1 }} className="billing-tax-select">
                      <InputLabel id="demo-simple-select-autowidth-label">Igst</InputLabel>
                      <Select labelId="demo-simple-select-autowidth-label" id="demo-simple-select-autowidth" onChange={handleIgstChange} autoWidth label="Cgst" value={igst.toString()}>                    
                        {Array.from({ length: 29 }, (_, index) => index).map((value) => (
                          <MenuItem key={value} value={value}>{value === 0 ? '0%' : `${value} ${value === 1 ? '%' : '%'}`}</MenuItem>
                        ))}
                      </Select>
                     </FormControl>
                    </div>
                    <div>
                      <Typography variant="h6" component="article" className="label">Brokerage Amount : </Typography>
                      <Typography variant="body1" component="article" className="value">{brokerageAmt}</Typography>
                    </div>
                      
                    </div>
                    )
                  }


                   {contractDataList && contractDataList.length > 0 && (
                    <div className="net-amount-wrapper">                      
                    <div>
                      <Typography variant="h6" component="article" className="label">Grand Total Amount : </Typography>
                        <Typography variant="body1" component="article" className="value">{grandTotalAmt} 
                          ({converter.toWords(grandTotalAmt)})
                          </Typography>
                    </div>
                  </div>
                  )}


                  {contractDataList && contractDataList.length === 0 && (                    
                      <div className="no-contract-found">
                      <hr />                      
                      <Typography variant="body1" component="article" className="label"><b>No Contract Found</b></Typography>
                      </div>                      
                  )}


                  {contractDataList && contractDataList.length > 0 && (
                    <div className="btn-wrapper">
                        <Button type="submit" variant="contained" fullWidth>Submit</Button>
                    </div>
                  )}
                  
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>      
      <SuccessConfirmationDialogue isOpen={isSuccessDialogOpen} heading="Billing Updated Successfully" redirect="billing" onClick={successDialogCloseHandler} />
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query;
  const detail = await getBilling(id as string);
  console.log(detail)
  return {
    props: { detail }
  };
};

