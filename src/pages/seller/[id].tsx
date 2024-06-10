import React, { useState, useEffect } from "react";
import { Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSeller } from "@/services/seller";

const Header = dynamic(() => import('../../../components/header/index'));

interface compProps {
  detail: { data: {} };
}

interface DetailData {
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
  account_detail: string;
  updatedDate: Date | null;
  deletedDate: Date | null;
  isDeleted: boolean;
  createdDate: Date;
  __v: number;
}

const Index: React.FC<compProps> = ({ detail }) => {

  const router = useRouter();
  const [detailData, setDetailData] = useState<DetailData>(detail.data as DetailData);

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }

  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };


  return (
    <>
      <Header />

      <Container maxWidth="xl">
        <div className="header-content">
          <div>
            <Typography variant="h5" component="article">Seller Detail</Typography>
          </div>
          <div className="btn-wrapper">
            <Button variant="outlined" onClick={() => goToPage('/seller')}>Back</Button>
          </div>
        </div>

        <div className="detail-wrapper">

          <div className="column"><Typography variant="body1" component="article"><b>Name</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.name}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Email</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.email}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Telephone no</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.telephone_no}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Mobile no</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.mobile_no}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Fax no</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.fax}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Pan no</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.pan}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>GSTIN</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.gstin}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>State Code</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.state_code}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Account Detail</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.account_detail}</span></Typography></div>

        </div>

      </Container>

    </>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const { id } = context.query;
  const detail = await getSeller(id as string);

  return {
    props: {
      detail
    }
  };


};

