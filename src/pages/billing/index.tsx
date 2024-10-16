import React, { useState, useEffect } from "react";
import { Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { deleteBilling, getAllBilling } from "@/services/billing";
import { customFormatDate } from "@/services/common";

const Header = dynamic(() => import('../../../components/header/index'));
const ConfirmationDialogue = dynamic(() => import('../../../components/confirmation-pop/index'));


export default function Index() {

  const columns: GridColDef[] = [
    { field: 'billingNo', headerName: 'Billing No', width: 140 },
    { field: 'contractReferenceNo', headerName: 'Reference No', width: 170 },    
    { field: 'billDate', headerName: 'Date', width: 100, valueGetter: (params) => { return customFormatDate(new Date(params)) } },  
    { field: 'buyer', headerName: 'Buyer', width: 100 },    
    { field: 'seller', headerName: 'Seller', width: 100 },    
    { field: 'quantity', headerName: 'Qty', width: 50 },    
    { field: 'price', headerName: 'Price', width: 50 },    
    { field: 'brokeragePrice', headerName: 'Brokerage Price', width: 120 },    
    { field: 'brokerageOn', headerName: 'Brokerage On', width: 100 },
    { field: 'sgst', headerName: 'SGST', width: 50 },
    { field: 'cgst', headerName: 'CGST', width: 50 },
    { field: 'igst', headerName: 'IGST', width: 50 },
    { field: 'brokerageAmount', headerName: 'Brokerage Amt', width: 120 },
    {
      field: 'action',
      headerName: 'Action',
      width: 400,
      renderCell: (params) => (
        <div className="action-btn-wrapper">
          <Button variant="contained" color="success" onClick={() => handleEdit(params.id)}>Edit</Button>
          <Button variant="contained" color="inherit" onClick={() => handleDetail(params.id)}>Detail</Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(params.id)}>Delete</Button>
        </div>
      ),
    }
  ];

  const router = useRouter();
  const [rowData, setRowData] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemId, setItemId] = useState();


  const handleEdit = (id: any) => {
    router.push(`/billing/edit/${id}`);
  };

  const handleDetail = (id: any) => {
    router.push(`/billing/${id}`);
  };

  const handleDelete = async (id: any) => {
    setDialogOpen(true);
    setItemId(id);
  };

    const fetchData = async () => {
      try {
        const response = await getAllBilling();
        const formattedData = response.data.map((billing: any) => ({ ...billing, id: billing._id, _id: undefined }));        
        setRowData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }
    fetchData();
  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  const handleAgree = async () => {

    try {
      await deleteBilling(itemId!);
      setRowData((prevRowData) => prevRowData.filter((billing) => billing.id !== itemId));

    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setDialogOpen(false);
  };

  const handleDisagree = () => {
    setDialogOpen(false);
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
            <Button variant="outlined" onClick={() => goToPage('/master')}>Back</Button>
          </div>
        </div>

        <div className="list-wrapper">
          <DataGrid
            rows={rowData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </Container>
      <ConfirmationDialogue isOpen={dialogOpen} onAgree={handleAgree} onDisagree={handleDisagree} heading="Are you sure want to delete?" />
    </>
  );
}


