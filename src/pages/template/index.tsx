import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { deleteTemplate, getAllTemplates } from "@/services/template";
import { format } from 'date-fns';
import { customDateFormatter } from '../../services/common';

const Header = dynamic(() => import('../../../components/header/index'));
const ConfirmationDialogue = dynamic(() => import('../../../components/confirmation-pop/index'));


export default function Index() {

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      width: 200,
      valueGetter: (value, row) => `${customDateFormatter(row.createdDate)}`,
    },
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
    router.push(`/template/edit/${id}`);
  };

  const handleDetail = (id: any) => {
    router.push(`/template/${id}`);
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
        const response = await getAllTemplates();
        const formattedData = response.data.map((template: any) => ({ ...template, id: template._id, _id: undefined }));        
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
      const response: any = await deleteTemplate(itemId!);
      setRowData((prevRowData) => prevRowData.filter((template) => template.id !== itemId));

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
            <Typography variant="h5" component="article">Template List</Typography>
          </div>
          <div className="btn-wrapper">
            <Button variant="contained" color="success" onClick={() => goToPage('/template/create')}>Create</Button>
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


