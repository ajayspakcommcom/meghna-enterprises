import React, { useState, useEffect } from "react";
import { Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { deleteContract, getAllContracts } from "@/services/contract";
import { customDateFormatter } from '../../services/common';

const Header = dynamic(() => import('../../../components/header/index'));
const ConfirmationDialogue = dynamic(() => import('../../../components/confirmation-pop/index'));


export default function Index() {

  const columns: GridColDef[] = [
    { field: 'contract_no', headerName: 'Contract No', width: 100 },
    {
      field: 'buyer_id',
      headerName: 'Buyer',
      width: 200,
      valueGetter: (value, row) => `${row.buyer_id.name}`,
    },
    {
      field: 'seller_id',
      headerName: 'Seller',
      width: 200,
      valueGetter: (value, row) => `${row.seller_id.name}`,
    },

    { field: 'quantity', headerName: 'Quantity', width: 100 },
    { field: 'price', headerName: 'Price', width: 80 },
    {
      field: 'assessment_year',
      headerName: 'Financial Year',
      width: 120,
      valueGetter: (value, row) => `${row.assessment_year}`,
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      width: 120,
      valueGetter: (value, row) => `${customDateFormatter(row.createdDate)}`,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 400,
      renderCell: (params) => (
        <div className="action-btn-wrapper">
          {/* <Button variant="contained" color="success" onClick={() => handleEdit(params.id)}>Edit</Button> */}
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
    console.log('Edit', id);
  };

  const handleDetail = (id: any) => {
    router.push(`/contract/${id}`);
  };

  const handleDelete = async (id: any) => {
    setDialogOpen(true);
    setItemId(id);
  };


  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }


    const fetchData = async () => {
      try {
        const response = await getAllContracts();
        const formattedData = response.data.map((contract: any) => ({ ...contract, id: contract._id, _id: undefined }));
        console.log(formattedData);
        setRowData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  const handleAgree = async () => {

    try {
      const response: any = await deleteContract(itemId!);
      setRowData((prevRowData) => prevRowData.filter((seller) => seller.id !== itemId));

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
            <Typography variant="h5" component="article">Contract List</Typography>
          </div>
          <div className="btn-wrapper">
            <Button variant="contained" color="success" onClick={() => goToPage('/contract/create')}>Create</Button>
            <Button variant="outlined" onClick={() => goToPage('/dashboard')}>Back</Button>
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


