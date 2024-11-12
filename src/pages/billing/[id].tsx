import React, { useState, useEffect } from "react";
import {Card,CardContent,Button,Typography, TextField, Container, Autocomplete, FormControl, Select, InputLabel, MenuItem, FormHelperText, SelectChangeEvent, Grid, ListItem } from "@mui/material";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {convertHtmlToPdf, getBilling, sendBillOnEmail} from "@/services/billing";
import { customFormatDate, getBillingHtmlTemplate } from "@/services/common";
import { getBuyer } from "@/services/buyer";
import { getSeller } from "@/services/seller";



const Header = dynamic(() => import('../../../components/header/index'));
const SuccessConfirmationDialogue = dynamic(() => import('../../../components/success-confirmation/index'));
const BillingPreviewDialogue = dynamic(() => import('../../../components/billing-preview/index'));
const CircularProgressLoader = dynamic(() => import('../../../components/loader/index'));
const converter = require('number-to-words');


interface compProps {
  detail: { data: {} };
}

interface Contract {
  contractId: string;
  quantity: number;
  price: string; // Assuming the price is a string based on the provided data
  brokerageQty: number;
  brokerageAmt: number;
  partyId: string;
  isBillCreated: boolean;
  _id: string;
}

interface DetailData {
  _id: string;
  billingNo: string;
  billingDate: string; // Use `Date` if it is converted to a Date object during parsing
  partyType: 'Buyer' | 'Seller'; // Assuming it can only be 'Buyer' or 'Seller'
  partyId: string;
  contracts: Contract[];
  sgst: number;
  cgst: number;
  igst: number;
  netAmount: number;
  brokerage: number;
  grandTotalAmt: number;
  outstandingAmount: number;
  createdDate: string; // Use `Date` if needed
  updatedDate: string | null;
  deletedDate: string | null;
  isDeleted: boolean;
  __v: number;
}

interface UserDetail {
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
  updatedDate: string | null;
  deletedDate: string | null;
  isDeleted: boolean;
  account_detail: string;
  createdDate: string;
  __v: number;
}

const Index: React.FC<compProps> = ({ detail }) => {

  const router = useRouter();
  const [detailData, setDetailData] = useState<DetailData>(detail.data as DetailData);
  const [userData, setUserData] = useState<UserDetail>();
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>();
  const [isLoader, setIsLoader] = useState<boolean>(false);  
   const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const getUserPartyData = async (partyType: string) => {
    const partyData = partyType.toLowerCase() === 'buyer' ? await getBuyer(detailData.partyId) : await getSeller(detailData.partyId);       
    return (partyData as any).data;
  }


   const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  useEffect(() => {    
    const fetchPartyData = async () => {      
    try {
      const respPartyData = await getUserPartyData(detailData.partyType);      
      setUserData(respPartyData);
    } catch (error) {
      console.log('Failed to fetch party data:', error);      
    }
    };

  fetchPartyData();

  }, [detail]);

  const downloadBillingPdf = async () => {

    const partyData = detailData.partyType.toLowerCase() === 'buyer' ? await getBuyer(detailData.partyId) : await getSeller(detailData.partyId);    
    const htmlData = { billingData: detailData, partyData: (partyData as any).data };

    const billingData = { html: getBillingHtmlTemplate(htmlData) };
    try {
        const response = await convertHtmlToPdf(billingData);     
        
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
  }

  const previewHandler = () => {
    setIsPreviewDialogOpen(true);
    setPreviewContent({...detailData, name: userData?.name});    
  };

  const previewClickHandler = (val: boolean) => {
    setIsPreviewDialogOpen(val)
  };

  const onSuccessConfirmationHandler = (val: boolean) => {    
    setIsSuccessDialogOpen(val);
  };

  const sendEmailHandler = async () => {

    console.log('detailData', detailData);
    console.log('userData', userData);

    const updatedContracts = detailData.contracts.map((contract) => {
      return {
        ...contract,
        name: userData?.name
      }
    });

    const objData = {
      billingData: {
        billingNo: detailData.billingNo,
        billingDate: detailData.billingDate,
        contracts: [...updatedContracts],
        sgst: detailData.sgst,
        cgst: detailData.cgst,
        igst: detailData.igst,
        netAmount: detailData.netAmount,
        brokerage: detailData.brokerage,
        grandTotalAmt: detailData.grandTotalAmt,
      },
      partyData: {
        name: userData?.name,
        address: userData?.address,
        gstin: userData?.gstin,
        state_code: userData?.state_code,
        email: userData?.email
      },
    };

    setDetailData((prevDetailData: any) => ({
      ...prevDetailData
    }));
    setIsLoader(true);

    try {
      const respData = await sendBillOnEmail(objData);
      setIsSuccessDialogOpen(true);
      setIsLoader(false);
    } catch (error: any) {
      console.log(`Error : ${error}`);
    }

  };
  
 
  return (
    <>
      
      <Header />

      <Container maxWidth="xl">
        <div className="header-content">
          <div>
            <Typography variant="h5" component="article">Billing Detail</Typography>
          </div>
          <div className="btn-wrapper detail-btn-wrapper">
            <Button variant="outlined" onClick={() => previewHandler()}>Preview</Button>
            <Button variant="outlined" onClick={() => sendEmailHandler()}>Send Mail</Button>
            {/* <Button variant="outlined" onClick={downloadBillingPdf}>Download Pdf</Button> */}
            <Button variant="outlined" onClick={() => goToPage("/billing")}>Back</Button>
          </div>
        </div>

        <div>
            <Card>
              <CardContent>
                <form  className="form billing-form">

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
                            value={detailData.billingNo}                                                      
                            disabled={true}
                          />
                      </ListItem>
                    </Grid>
                    <Grid item xs={3}>
                      <ListItem>
                        <TextField   
                            type="text"
                            label="Billing Date"
                            name="billingDate"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink: true }}
                            value={customFormatDate(new Date(detailData.billingDate))}
                        disabled={true}
                          />
                      </ListItem>
                    </Grid>
                    <Grid item xs={3}>
                      <ListItem>
                        <TextField   
                            type="text"
                            label="Name"
                            name="billingDate"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink: true }}
                            value={userData?.name}
                            disabled={true}
                          />                      
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
                        InputLabelProps={{shrink: true }}
                            value={userData?.email ?? ''}                                                      
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
                            InputLabelProps={{shrink: true }}
                            value={userData?.mobile_no ?? ''}                                                      
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
                          InputLabelProps={{shrink: true }}
                          value={userData?.address ?? ''}                          
                          disabled={true}
                          multiline  
                          rows={2}  
                        />
                      </ListItem>
                    </Grid>
                  </Grid>

                  {detailData.contracts && detailData.contracts.length > 0 && (
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

                  {detailData.contracts && detailData.contracts.length > 0 && detailData.contracts.map((contract: any, index: number) => (
                    <div key={contract._id} className="billing-contract-form">
                    <TextField
                        label="Date"
                        type="text"
                        fullWidth
                        margin="normal"
                        value={customFormatDate(new Date(contract.createdDate))}                    
                        disabled={true}    
                    />

                    <TextField
                        label="Contract No"
                        type="text"
                        fullWidth
                        margin="normal"
                        value={contract.contractNo}                    
                        disabled={true}    
                        />
                        
                    <TextField
                        label="Category"
                        type="text"
                        fullWidth
                        margin="normal"
                        value={contract.partyType}                    
                        disabled={true}    
                    />

                    <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={contract.quantity || 0}                    
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
                        value={contract.brokerageQty || 0}     
                        disabled={true}
                    />


                    <TextField
                        label="Amount"
                        type="text"
                        fullWidth
                        margin="normal"
                        value={contract.brokerageAmt || 0}                    
                        disabled={true}   
                    />
                    </div>
                  ))}
                  
                  {detailData.contracts && detailData.contracts.length > 0 && (
                    <div className="net-amount-wrapper">                      
                    <div>
                      <Typography variant="h6" component="article" className="label">Net Amount : </Typography>
                      <Typography variant="body1" component="article" className="value">{detailData.netAmount}</Typography>
                    </div>
                  </div>
                  )}

                  {detailData.contracts && detailData.contracts.length > 0 &&
                    (
                    <div className="gross-amount-wrapper">
                      <div>
                      <FormControl sx={{ m: 1 }} className="billing-tax-select" disabled={true}>
                      <InputLabel id="demo-simple-select-autowidth-label">Sgst</InputLabel>
                      <Select labelId="demo-simple-select-autowidth-label" id="demo-simple-select-autowidth"  autoWidth label="Sgst" value={detailData.sgst.toString()}>                                          
                          {Array.from({ length: 29 }, (_, index) => index).map((value) => (
                          <MenuItem key={value} value={value}>{value === 0 ? 'None' : `${value} ${value === 1 ? '%' : '%'}`}</MenuItem>
                        ))}
                      </Select>
                      </FormControl>
                      
                      <FormControl sx={{ m: 1 }} className="billing-tax-select" disabled={true}>
                      <InputLabel id="demo-simple-select-autowidth-label">Cgst</InputLabel>
                      <Select labelId="demo-simple-select-autowidth-label" id="demo-simple-select-autowidth" autoWidth label="Cgst" value={detailData.cgst.toString()}>                    
                        {Array.from({ length: 29 }, (_, index) => index).map((value) => (
                          <MenuItem key={value} value={value}>{value === 0 ? 'None' : `${value} ${value === 1 ? '%' : '%'}`}</MenuItem>
                        ))}
                      </Select>
                     </FormControl>
                    
                     <FormControl sx={{ m: 1 }} disabled={true} className="billing-tax-select">
                      <InputLabel id="demo-simple-select-autowidth-label">Igst</InputLabel>
                      <Select labelId="demo-simple-select-autowidth-label" id="demo-simple-select-autowidth" autoWidth label="Cgst" value={detailData.igst.toString()}>                    
                        {Array.from({ length: 29 }, (_, index) => index).map((value) => (
                          <MenuItem key={value} value={value}>{value === 0 ? 'None' : `${value} ${value === 1 ? '%' : '%'}`}</MenuItem>
                        ))}
                      </Select>
                     </FormControl>
                    </div>
                    <div>
                      <Typography variant="h6" component="article" className="label">Brokerage Amount : </Typography>
                      <Typography variant="body1" component="article" className="value">{detailData.brokerage}</Typography>
                    </div>
                      
                    </div>
                    )
                  }


                   {detailData.contracts && detailData.contracts.length > 0 && (
                    <div className="net-amount-wrapper">                      
                    <div>
                      <Typography variant="h6" component="article" className="label">Grand Total Amount : </Typography>
                        <Typography variant="body1" component="article" className="value">{detailData.grandTotalAmt} ({converter.toWords(detailData.grandTotalAmt)})</Typography>
                    </div>
                  </div>
                  )}


                  {detailData.contracts && detailData.contracts.length === 0 && (                    
                      <div className="no-contract-found">
                      <hr />                      
                      <Typography variant="body1" component="article" className="label"><b>No Contract Found</b></Typography>
                      </div>                      
                  )}


                </form>
              </CardContent>
            </Card>
          </div>
        
      </Container>     
      
      <BillingPreviewDialogue isOpen={isPreviewDialogOpen} heading="Contract Preview" contentData={previewContent} onClick={previewClickHandler} />
      <SuccessConfirmationDialogue isOpen={isSuccessDialogOpen} heading="Bill sent successfully" onClick={onSuccessConfirmationHandler} redirect="billing" />
      {isLoader && <CircularProgressLoader />}

    </>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const { id } = context.query;  
  const detail = await getBilling(id as string);      
  return {
    props: {
      detail
    }
  };
};

