import React, { useState, useEffect } from "react";
import { Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getTemplate } from "@/services/template";

const Header = dynamic(() => import('../../../components/header/index'));

interface compProps {
  detail: { data: {} };
}

interface DetailData {
  _id: string;
  name: string;
  label: {};
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
            <Typography variant="h5" component="article">Template Detail</Typography>
          </div>
          <div className="btn-wrapper">
            <Button variant="outlined" onClick={() => goToPage('/template')}>Back</Button>
          </div>
        </div>

        {/* <div>{JSON.stringify(detailData)}</div> */}

        <div className="detail-wrapper">



          <div className="column"><Typography variant="body1" component="article"><b>Name</b></Typography></div>
          <div className="column"><Typography variant="body1" component="article"><span>{detailData.name}</span></Typography></div>

          <div className="column"><Typography variant="body1" component="article"><b>Heading</b></Typography></div>
          <div className="column">
            <ul className="detail-ul">
              {Object.entries(detailData.label).map(([key, value]) => (
                <li key={key}>
                  <Typography variant="body1" component="article"><b>{key}:</b> <span>{value as string}</span></Typography>
                </li>
              ))}
            </ul>
          </div>


        </div>

      </Container>

    </>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const { id } = context.query;
  const detail = await getTemplate(id as string);

  return {
    props: {
      detail
    }
  };

};

