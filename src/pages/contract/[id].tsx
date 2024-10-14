import React, { useState, useEffect } from "react";
import { Button, Typography, Container, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { generatePdf, getContract, sendContractOnEmail } from "@/services/contract";
import { customDateFormatter, getCompanyName, getLocalStorage } from "@/services/common";

const Header = dynamic(() => import('../../../components/header/index'));
const SuccessConfirmationDialogue = dynamic(() => import('../../../components/success-confirmation/index'));
const ContractPreviewDialogue = dynamic(() => import('../../../components/contract-preview/index'));
const CircularProgressLoader = dynamic(() => import('../../../components/loader/index'));

interface compProps {
  detail: { data: {} };
}

interface DetailData {
  _id: string;
  contract_no: string;
  buyer_id: string;
  seller_id: string;
  template: {};
  label: {},
  quantity: number;
  price: number;
  assessment_year: string;
  updatedDate: Date | null;
  deletedDate: Date | null;
  isDeleted: boolean;
  createdDate: Date;
  __v: number;
}

const Index: React.FC<compProps> = ({ detail }) => {

  const router = useRouter();
  const [detailData, setDetailData] = useState<any>({ ...detail.data as DetailData, logo: getLocalStorage('appLogo') });
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>();
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [logo, setLogo] = React.useState<string | null>('');

  useEffect(() => {

    console.log('detailData', detailData);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }

    if (getLocalStorage('appLogo')) {
      setLogo(getLocalStorage('appLogo'))
    }
  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  const previewHandler = () => {
    setIsPreviewDialogOpen(true);

    const objectData: any = {
      contract_no: detailData.contract_no,
      createdDate: detailData.createdDate,
      selectedSeller: { _id: detailData.seller_id._id as string, label: detailData.seller_id.name },
      selectedBuyer: { _id: detailData.buyer_id._id as string, label: detailData.buyer_id.name },
      selectedTemplate: { ...detailData.template },
      labelFields: { ...detailData.label },
      formikValues: { quantity: detailData.price, price: detailData.quantity }
    };

    setPreviewContent(objectData);

  };

  const sendEmailHandler = async () => {

    setDetailData((prevDetailData: any) => ({
      ...prevDetailData
    }));

    setIsLoader(true);
    try {
      const response = await sendContractOnEmail(detailData);      
      setIsSuccessDialogOpen(true);
      setIsLoader(false);
    } catch (error: any) {      
    }

  };


  const onSuccessConfirmationHandler = (val: boolean) => {    
    setIsSuccessDialogOpen(val);
  };

  const previewClickHandler = (val: boolean) => {
    setIsPreviewDialogOpen(val)
  };

  // const getPdfLink = (fileName: string) => {
  //   return `/pdf/${fileName}`;
  // };

  const generatePdfHandler = async () => {
    console.clear();

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

  return (
    <>
      <Header />

      <Container maxWidth="xl">
        <div className="header-content">
          <div>
            <Typography variant="h5" component="article">Contract Detail</Typography>
          </div>
          <div className="btn-wrapper detail-btn-wrapper">
            <Button variant="outlined" onClick={() => previewHandler()}>Preview</Button>
            <Button variant="outlined" onClick={() => sendEmailHandler()}>Send Mail</Button>
            <Button variant="outlined" onClick={() => generatePdfHandler()}>Download Pdf</Button>
            <Button variant="outlined" onClick={() => goToPage('/contract')}>Back</Button>
          </div>
        </div>


        <div className="detail-wrapper contract-detail-wrapper">

          <div className="column"><Typography variant="body1" component="article"><b>Contract No</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.contract_no}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Company</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{getCompanyName(detailData.company)}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Buyer</b></Typography></div>

          <div className="column">
            <ul className="detail-ul">
              {Object.entries(detailData.buyer_id).filter(([key]) => key !== '_id' && key !== '__v' && key !== 'isDeleted' && key !== 'updatedDate' && key !== 'deletedDate' && key !== 'createdDate').map(([key, value]) => (
                <li key={key}>
                  <Typography variant="body1" component="article"><b>{key.charAt(0).toUpperCase() + key.slice(1)}:</b> <span>{value as string}</span></Typography>
                </li>
              ))}
            </ul>
          </div>

          <div className="column"><Typography variant="body1" component="article"><b>Seller</b></Typography></div>
          <div className="column">
            <ul className="detail-ul">
              {Object.entries(detailData.seller_id).filter(([key]) => key !== '_id' && key !== '__v' && key !== 'isDeleted' && key !== 'updatedDate' && key !== 'deletedDate' && key !== 'createdDate').map(([key, value]) => (
                <li key={key}>
                  <Typography variant="body1" component="article"><b>{key.charAt(0).toUpperCase() + key.slice(1)}:</b> <span>{value as string}</span></Typography>
                </li>
              ))}
            </ul>
          </div>

          <div className="column"><Typography variant="body1" component="article"><b>Quantity</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{JSON.stringify(detailData.quantity)}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Price</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{JSON.stringify(detailData.price)}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Financial Year</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.assessment_year}</span></Typography></div>


          {Object.entries(detailData.template).filter(([key]) => key !== '_id' && key !== '__v' && key !== 'isDeleted' && key !== 'updatedDate' && key !== 'deletedDate' && key !== 'createdDate').map(([key, value]) => (
            <React.Fragment key={key}>
              <div className="column"><Typography variant="body1" component="article"><b>{key.charAt(0).toUpperCase() + key.slice(1)}</b></Typography></div>
              <div className="column"><Typography variant="body1" component="article"><span>{value as string}</span></Typography></div>
            </React.Fragment>
          ))}


          {Object.entries(detailData.label).filter(([key]) => key !== '_id' && key !== '__v' && key !== 'isDeleted' && key !== 'updatedDate' && key !== 'deletedDate' && key !== 'createdDate').map(([key, value]) => (
            <React.Fragment key={key}>
              <div className="column"><Typography variant="body1" component="article"><b>{key.charAt(0).toUpperCase() + key.slice(1)}</b></Typography></div>
              <div className="column"><Typography variant="body1" component="article"><span>{value as string}</span></Typography></div>
            </React.Fragment>
          ))}

        </div>

      </Container>

      <ContractPreviewDialogue isOpen={isPreviewDialogOpen} heading="Contract Preview" contentData={previewContent} onClick={previewClickHandler} />
      <SuccessConfirmationDialogue isOpen={isSuccessDialogOpen} heading="Contract sent successfully" onClick={onSuccessConfirmationHandler} redirect="contract" />
      {isLoader && <CircularProgressLoader />}


    </>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const { id } = context.query;
  const detail = await getContract(id as string);
  return {
    props: {
      detail
    }
  };


};

