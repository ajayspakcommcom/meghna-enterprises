import React, { useEffect, useState } from "react";
import { Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { deleteBilling, getAllBilling, getBillReport } from "@/services/billing";
import { customFormatDate } from "@/services/common";


const Header = dynamic(() => import('../../../components/header/index'));
const ConfirmationDialogue = dynamic(() => import('../../../components/confirmation-pop/index'));


export default function Index() {

  const router = useRouter();

  const [rowData, setRowData] = React.useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemId, setItemId] = useState();

  const columns: GridColDef[] = [
    { field: 'billingDate', headerName: 'Date', width: 95, valueGetter: (params) => { return customFormatDate(new Date(params)) } },  
    {field:'billingNo', headerName:'Bill No', width:140},
    {
      field: 'name', headerName: 'Party Name', width: 300, 
      valueGetter: (value, row) => {
        return row.partyDetail.name
      },
    },
    {
      field: 'gstin', headerName: 'GSTIN', width: 155,
      valueGetter: (value, row) => {        
        return row.partyDetail.gstin
      },
    },
    {
      field: 'state_code', headerName: 'State Code', width: 155,
      valueGetter: (value, row) => {        
        return row.partyDetail.state_code
      },
    },
    { field: 'netAmount', headerName: 'Net Amount', width: 100 },
    {
      field: 'sgst', headerName: 'Sgst', width: 50, 
      valueGetter: (value, row) => {        
        return `${row.sgst}%`
      }
    },
    {
      field: 'cgst', headerName: 'Cgst', width: 50, 
      valueGetter: (value, row) => {        
        return `${row.cgst}%`
      }
    },
    {
      field: 'igst', headerName: 'Igst', width: 50, 
      valueGetter: (value, row) => {        
        return `${row.igst}%`
      }
    },
    { field: 'grandTotalAmt', headerName: 'Grand Total', width: 100 },
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


  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <div className="header-content">
          <div>
            <Typography variant="h5" component="article">Billing List</Typography>
          </div>
          <div className="btn-wrapper three-btn">
            <Button variant="contained" color="success" onClick={() => goToPage('/billing/create')}>Create</Button>
            <Button variant="contained" color="success" onClick={() => goToPage('/billing/report')}>Report</Button> 
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


