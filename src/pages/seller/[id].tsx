import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Seller from "../../../models/Seller";
import { useFormik } from "formik";
import ErrorMessage from "../../../components/error-message";
import sellerSchema from "@/validation/sellerSchema";
import { getSeller } from "@/services/seller";

const Header = dynamic(() => import('../../../components/header/index'));

interface compProps {
  detail: { data: {} };
}

const Index: React.FC<compProps> = ({ detail }) => {

  const router = useRouter();
  const [detailData, setDetailData] = useState(detail);

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
            <Typography variant="h5" component="article">Buyer List</Typography>
          </div>
          <div className="btn-wrapper">
            <Button variant="outlined" onClick={() => goToPage('/seller')}>Back</Button>
          </div>
        </div>

        <div className="detail-wrapper">
          <h1>Detail {JSON.stringify(detailData)}</h1>
        </div>

      </Container>

    </>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const { id } = context.query;
  const detail = await getSeller(id as string);

  console.log('details', detail);

  return {
    props: {
      detail
    }
  };


};

