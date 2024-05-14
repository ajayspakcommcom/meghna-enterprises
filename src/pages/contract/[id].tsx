import React, { useState, useEffect } from "react";
import { Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getContract } from "@/services/contract";
import { customDateFormatter } from "@/services/common";

const Header = dynamic(() => import('../../../components/header/index'));

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
            <Typography variant="h5" component="article">Contract Detail</Typography>
          </div>
          <div className="btn-wrapper">
            <Button variant="outlined" onClick={() => goToPage('/contract')}>Back</Button>
          </div>
        </div>


        <div className="detail-wrapper">

          <div className="column"><Typography variant="body1" component="article"><b>Contract No</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.contract_no}</span></Typography></div>

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

        </div>

      </Container>

    </>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const { id } = context.query;
  const detail = await getContract(id as string);
  console.clear();
  console.log('Res ', detail);

  return {
    props: {
      detail
    }
  };


};

