import React, { useState, useEffect } from "react";
import {Card,CardContent,Button,Typography, TextField, Container, Autocomplete, FormControl, Select, InputLabel, MenuItem, FormHelperText, SelectChangeEvent, Grid, ListItem } from "@mui/material";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {getBilling} from "@/services/billing";
import { customFormatDate } from "@/services/common";
const converter = require('number-to-words');

const Header = dynamic(() => import('../../../components/header/index'));


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

const Index: React.FC<compProps> = ({ detail }) => {

  const router = useRouter();
  const [detailData, setDetailData] = useState<DetailData>(detail.data as DetailData);

  useEffect(() => {
    console.log('detail', detail.data);
  }, [detail]);
 
  return (
    <>
      <Header />

      <Container maxWidth="xl">
        <div className="header-content">
          <div>
            <Typography variant="h5" component="article">Billing Detail</Typography>
          </div>
          <div className="btn-wrapper detail-btn-wrapper">
            <Button variant="outlined">Preview</Button>
            <Button variant="outlined">Send Mail</Button>
            <Button variant="outlined">Download Pdf</Button>
            <Button variant="outlined">Back</Button>
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
                            label="Billing Date"
                            name="billingDate"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink: true }}
                            value={'Name'}
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
                            value={'Email'}                                                      
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
                            value={'Mobile'}                                                      
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
                          value={'Address'}                          
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

