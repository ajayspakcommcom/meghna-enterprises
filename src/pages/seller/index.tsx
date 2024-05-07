import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getAllSellers } from "@/services/seller";

const Header = dynamic(() => import('../../../components/header/index'));

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'telephone_no', headerName: 'Telephone No', width: 200 },
  { field: 'mobile_no', headerName: 'Mobile No', width: 200 },
  { field: 'fax', headerName: 'Fax', width: 200 },
  { field: 'pan', headerName: 'Pan', width: 200 },
  { field: 'gstin', headerName: 'GSTIN', width: 200 },
  { field: 'state_code', headerName: 'State Code', width: 200 }
];


export default function Index() {

  const router = useRouter();
  const [rowData, setRowData] = useState<any[]>([]);


  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }


    const fetchData = async () => {
      try {
        const response = await getAllSellers();
        const formattedData = response.data.map((seller: any) => ({ ...seller, id: seller._id, _id: undefined }));
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

  return (
    <>
      <Header />

      <div className="header-content">
        <div>
          <Typography variant="h5" component="article">Seller List</Typography>
        </div>
        <div className="btn-wrapper">
          <Button variant="contained" color="success" onClick={() => goToPage('/seller/create')}>Create</Button>
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

    </>
  );
}


