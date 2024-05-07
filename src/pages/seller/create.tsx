import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const Header = dynamic(() => import('../../../components/header/index'));



export default function Index() {

  const router = useRouter();


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

      <div className="header-content">
        <div>
          <Typography variant="h5" component="article">Create List</Typography>
        </div>
        <div className="btn-wrapper">
          <Button variant="outlined" onClick={() => goToPage('/seller')}>Back</Button>
        </div>
      </div>


    </>
  );
}


