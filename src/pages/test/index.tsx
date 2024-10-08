import React, {useEffect } from "react";
import { Button, Container, Card, CardContent } from '@mui/material';
import dynamic from 'next/dynamic';
import { useFormik } from "formik";
import testSchema from "@/validation/testSchema";
const Header = dynamic(() => import('../../../components/header/index'));

const initialValues = {
    contractId: '',
    quantity: '',
    price: ''
};


export default function Index() {

const handleSubmit = () => {
    console.log("Form Submit");    
};

const handleReset = () => {
    console.log("Form Reset");    
};
    
const formik = useFormik({
    initialValues: initialValues,
    validationSchema: testSchema,
    onSubmit: handleSubmit,
    onReset: handleReset    
  });


  useEffect(() => {
  }, []);

  
  return (    
      <Container maxWidth="xl">
             <Card>
                  <CardContent>
                     <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                        <Button type='submit' variant="contained" fullWidth>Submit..</Button>
                    </form>
                  </CardContent>
            </Card>
      </Container>    
  );
}


