import React, { useEffect } from "react";
import { Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getAllBilling } from "@/services/billing";
import { customFormatDate } from "@/services/common";


const Header = dynamic(() => import('../../../components/header/index'));
const ConfirmationDialogue = dynamic(() => import('../../../components/confirmation-pop/index'));


export default function Index() {

  const router = useRouter();

  const [rowData, setRowData] = React.useState<any[]>([]);

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
    {field: 'sgst', headerName: 'Sgst', width: 50},
    {field: 'cgst', headerName: 'Cgst', width: 50},
    {field: 'igst', headerName: 'Igst', width: 50},
    {field: 'grandTotalAmt', headerName: 'Grand Total', width: 100},
  ];
  

  const handleEdit = (id: any) => {
    router.push(`/billing/edit/${id}`);
  };

  const fetchData = async () => {
      try {
        const response = await getAllBilling();
        const formattedData = response.data.map((billing: any) => ({ ...billing, id: billing._id, _id: undefined }));        
        console.log('formattedData', formattedData);
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
          <div className="btn-wrapper">
            <Button variant="contained" color="success" onClick={() => goToPage('/billing/create')}>Create</Button>
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
    </>
  );
}


