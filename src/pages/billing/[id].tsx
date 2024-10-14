import React, { useState, useEffect } from "react";
import { Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { generatePdf, getBilling, sendContractOnEmail } from "@/services/billing";

const Header = dynamic(() => import('../../../components/header/index'));
const BillingPreviewDialogue = dynamic(() => import('../../../components/billing-preview/index'));

interface compProps {
  detail: { data: {} };
}

interface DetailData {
  _id: string;
  billDate: string;  // ISO date string
  contractReferenceNo_Id: string;
  contractReferenceNo: string;
  buyer: string;
  seller: string;
  quantity: number;
  price: number;
  brokeragePrice: number;
  brokerageOn: 'Price' | 'Quantity';
  brokerageAmount: number;
  sgst: number;
  cgst: number;
  igst: number;
  createdDate: string;  // ISO date string
  updatedDate: string | null;
  deletedDate: string | null;
  isDeleted: boolean;
  __v: number;
}

const Index: React.FC<compProps> = ({ detail }) => {

  const router = useRouter();
  const [detailData, setDetailData] = useState<DetailData>(detail.data as DetailData);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>();
  const [isLoader, setIsLoader] = useState<boolean>(false);
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

   const previewHandler = () => {
     setIsPreviewDialogOpen(true);     
     setPreviewContent(detailData);
   };
  
   const sendEmailHandler = async () => {

    setDetailData((prevDetailData: any) => ({...prevDetailData}));
    setIsLoader(true);
    try {
      await sendContractOnEmail(detailData);      
      setIsSuccessDialogOpen(true);
      setIsLoader(false);
    } catch (error: any) {      
    }
   };
  
  const generatePdfHandler = async () => {    
    try {
      const response = await generatePdf(detailData);      

      if (response.message) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        const tempLink = document.createElement('a');
        tempLink.href = '/pdf/contract.pdf';
        tempLink.target = '_blank';
        tempLink.rel = 'noopener noreferrer';
        tempLink.download = '/pdf/contract.pdf';

        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      }

    } catch (error: any) {      
    }
  };

  const previewClickHandler = (val: boolean) => {     
    setIsPreviewDialogOpen(val)
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
            <Button variant="outlined" onClick={() => generatePdfHandler()}>Download Pdf</Button>
            <Button variant="outlined" onClick={() => goToPage('/billing')}>Back</Button>
          </div>
        </div>

        <div className="detail-wrapper">

          <div className="column"><Typography variant="body1" component="article"><b>Contract Reference No</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.contractReferenceNo}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Billing Date</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.billDate}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Buyer</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.buyer}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Seller</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.seller}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Quantity</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.quantity}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Price</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.price}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Brokerage Price</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.brokeragePrice}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Brokerga On</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.brokerageOn}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>SGST</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.sgst}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>CGST</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.cgst}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>IGST</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.igst}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Brokerage Amount</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.brokerageAmount}</span></Typography></div>

        </div>
      </Container>
      <BillingPreviewDialogue isOpen={isPreviewDialogOpen} heading="Billing Preview" contentData={previewContent} onClick={previewClickHandler} />
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

