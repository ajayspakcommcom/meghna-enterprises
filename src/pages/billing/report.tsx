import React, { useEffect, useState } from "react";
import {Container,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper, Button, Typography,} from "@mui/material";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {downBillReport, getBillReport} from "@/services/billing";
import { getCurrentFinancialYear } from "@/services/common";
import Image from "next/image";

const Header = dynamic(() => import("../../../components/header/index"));

interface BillingData {
  billingDate: string;
  billingNo: string;
  partyName: string;
  gstin: string;
  stateCode: string;
  netAmount: number;
  sgst: number;
  cgst: number;
  igst: number;
  round: number;
  grandTotalAmt: number;
}

interface TotalBillingData {
  totalAmount: number;
  totalSgst: number;
  totalCgst: number;
  totalIgst: number;
  totalRound: number;
  totalGrandTotal: number;
}

export default function Index() {

  const [rows, setRows] = useState<BillingData[]>([]);
  const [totalBillingData, setTotalBillingData] = useState<TotalBillingData>({totalAmount:0, totalSgst:0, totalCgst:0, totalIgst:0, totalRound:0, totalGrandTotal:0 });
  
  const router = useRouter();

  const fetchData = async () => {
    try {
      const data = (await getBillReport()).data.data;
      
      const totalCgst = data.reduce((accumulator:number, currentValue:BillingData) => {
        return accumulator + currentValue.cgst;
      }, 0);

      const totalSgst = data.reduce((accumulator:number, currentValue:BillingData) => {
        return accumulator + currentValue.sgst;
      }, 0);

      const totalIgst = data.reduce((accumulator:number, currentValue:BillingData) => {
        return accumulator + currentValue.igst;
      }, 0);

      const totalAmount = data.reduce((accumulator:number, currentValue:BillingData) => {
        return accumulator + currentValue.netAmount;
      }, 0);

      const totalGrandTotal = data.reduce((accumulator:number, currentValue:BillingData) => {
        return accumulator + currentValue.grandTotalAmt;
      }, 0);

      const totalRound = data.reduce((accumulator:number, currentValue:BillingData) => {
        return accumulator + currentValue.round;
      }, 0);


      setTotalBillingData({totalAmount,totalSgst,totalCgst,totalIgst,totalRound,totalGrandTotal});

      setRows(data); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
    fetchData();
  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  const donwloadPdfHandler = async () => {      
      
      try {
        const response = await downBillReport(rows);
        
        if (response.data.message) {          
          const blob = new Blob([response], { type: "application/pdf" });
          const blobUrl = URL.createObjectURL(blob);

          const tempLink = document.createElement("a");
          tempLink.href = "/pdf/billing_statement.pdf";
          tempLink.target = "_blank";
          tempLink.rel = "noopener noreferrer";
          tempLink.download = "/pdf/billing_statement.pdf";

          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);

          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 1000);
        }
      } catch (error: any) {}
      
  };

  return (
    <>
      <Header />
      <Container maxWidth="xl">  

      <div className="header-content">
          <div>
            <Typography variant="h5" component="article">Billing Report</Typography>
          </div>
          <div className="btn-wrapper report">            
            <Button variant="outlined" onClick={() => donwloadPdfHandler()}>Download PDF</Button>            
            <Button variant="outlined" onClick={() => goToPage('/billing')}>Back</Button>            
          </div>
        </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="billing table">
        <TableHead>
            <TableRow>
              <TableCell align="left" colSpan={11}>
                <div className="billing-reporting-header">
                  <Image src={require(`../../../public/images/seedsnfeeds.png`)} alt="seedsnfeeds" className="responsive-img center" />
                </div>
                <div className="billing-reporting-header-year">
                     <b>Accounting Year: {getCurrentFinancialYear(false).toString()}</b>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell align="left"><b>Date</b></TableCell>
              <TableCell align="left"><b>Bill No</b></TableCell>
              <TableCell align="left"><b>Party Name</b></TableCell>
              <TableCell align="left"><b>GSTIN</b></TableCell>
              <TableCell align="left"><b>State Code</b></TableCell>
              <TableCell align="left"><b>Amount</b></TableCell>
              <TableCell align="left"><b>SGST@9%</b></TableCell>
              <TableCell align="left"><b>CGST@9%</b></TableCell>
              <TableCell align="left"><b>IGST18%</b></TableCell>
              <TableCell align="left"><b>Round</b></TableCell>
              <TableCell align="left"><b>Total</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 && rows.map((row, index) => (
              <TableRow key={index}>                
                <TableCell scope="row">{new Date(row.billingDate).toLocaleDateString()}</TableCell>
                <TableCell align="left">{row.billingNo}</TableCell>
                <TableCell align="left">{row.partyName}</TableCell>
                <TableCell align="left">{row.gstin}</TableCell>
                <TableCell align="left">{row.stateCode}</TableCell>
                <TableCell align="left">{row.netAmount.toFixed(2)}</TableCell>
                <TableCell align="left">{row.sgst.toFixed(2)}</TableCell>
                <TableCell align="left">{row.cgst.toFixed(2)}</TableCell>
                <TableCell align="left">{row.igst.toFixed(2)}</TableCell>
                <TableCell align="left">{row.round.toFixed(2)}</TableCell>
                <TableCell align="left">{row.grandTotalAmt.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>                                
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"><b>{'Total'}</b></TableCell>
                <TableCell align="left"><b>{totalBillingData.totalAmount.toFixed(2)}</b></TableCell>
                <TableCell align="left"><b>{totalBillingData.totalSgst.toFixed(2)}</b></TableCell>
                <TableCell align="left"><b>{totalBillingData.totalCgst.toFixed(2)}</b></TableCell>
                <TableCell align="left"><b>{totalBillingData.totalIgst.toFixed(2)}</b></TableCell>
                <TableCell align="left"><b>{totalBillingData.totalRound.toFixed(2)}</b></TableCell>
                <TableCell align="left"><b>{totalBillingData.totalGrandTotal.toFixed(2)}</b></TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </>
  );
}
