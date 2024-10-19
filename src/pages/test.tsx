import React from "react";
import { Button, TextField, Autocomplete, Box, Container, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Header from "../../components/header";

type DataListItem = {
    _id: string;
    contract_no: string;
    seller_id: string;
    quantity: number;
    price: string;
    category: string;
    createdDate: string;    
    amount: number;
};

export default function Index() {

    const initialDataList = [
    {
      "_id": "6704c96ad6e4a6d2f62f40b5",
      "contract_no": "S&F/L/0003/2024-2025",
      "seller_id": "6704c958d6e4a6d2f62f409c",
      "quantity": 300,
      "price": "8",
      "category": "Seller",
      "createdDate": "2024-06-01T00:00:00.000Z",
      "amount": 2400
    },
    {
      "_id": "6704c96ad6e4a6d2f62f40b2",
      "contract_no": "S&F/L/0003/2024-2025",
      "seller_id": "6704c958d6e4a6d2f62f409c",
      "quantity": 300,
      "price": "8",
      "category": "Seller",
      "createdDate": "2024-06-01T00:00:00.000Z",
      "amount": 2400
        },
    {
      "_id": "6704c96ad6e4a6d2f62f40b9",
      "contract_no": "S&F/L/0003/2024-2025",
      "seller_id": "6704c958d6e4a6d2f62f409c",
      "quantity": 300,
      "price": "8",
      "category": "Seller",
      "createdDate": "2024-06-01T00:00:00.000Z",
      "amount": 2400
    }
    ];
    
    const [dataList, setDataList] = React.useState(initialDataList);
    
    const handleInputChange = (index: number,field: keyof DataListItem, value: string | number): void => {
    const updatedDataList = [...dataList];
    updatedDataList[index][field] = value as never;
        
    const price = parseFloat(updatedDataList[index].price);  
    const quantity = updatedDataList[index].quantity;         

    if (field === 'price' || field === 'quantity') {
      updatedDataList[index].amount = price * quantity;
    }

    setDataList(updatedDataList);
    };
    

    const handleSubmit = (dataList:any): void => {
        console.log(dataList);
    };

   

    const formik = useFormik({
        initialValues: initialDataList,    
        onSubmit: handleSubmit        
    });


    return (    
        <>
        <Header />
        <form onSubmit={formik.handleSubmit}>
            {dataList.map((contract, index) => (
                
                <div key={contract._id} className="test-form">
                <TextField
                    label="Date"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={contract.createdDate}
                    onChange={(e) => handleInputChange(index, 'createdDate', e.target.value)}
                    disabled={true}    
                />

                <TextField
                    label="Contract No"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={contract.contract_no}
                    onChange={(e) => handleInputChange(index, 'contract_no', e.target.value)}
                    disabled={true}    
                    />
                    
                <TextField
                    label="Category"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={contract.category}
                    onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                    disabled={true}    
                />

                <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={contract.quantity}
                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                    disabled={true}    
                />

                <TextField
                    label="Price"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={contract.price}
                    onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                />

                <TextField
                    label="Amount"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={contract.amount}
                    onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                    disabled={true}   
                />
                </div>
            ))}
            
            <Button type="submit" variant="contained" color="primary">Submit</Button>
        </form>
        </>
    );
}


