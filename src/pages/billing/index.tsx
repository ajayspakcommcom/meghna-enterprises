import React, { useEffect } from "react";
import { Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';


const Header = dynamic(() => import('../../../components/header/index'));
const ConfirmationDialogue = dynamic(() => import('../../../components/confirmation-pop/index'));


export default function Index() {

  const router = useRouter();
  

  const handleEdit = (id: any) => {
    router.push(`/billing/edit/${id}`);
  };

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
            <Typography variant="h5" component="article">Billing List</Typography>
          </div>
          <div className="btn-wrapper">
            <Button variant="contained" color="success" onClick={() => goToPage('/billing/create')}>Create</Button>
            <Button variant="outlined" onClick={() => goToPage('/dashboard')}>Back</Button>
          </div>
        </div>
      </Container>      
    </>
  );
}


