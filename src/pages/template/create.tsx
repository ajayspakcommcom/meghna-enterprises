import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';


const Header = dynamic(() => import('../../../components/header/index'));

interface Field {
  property: string;
  value: string;
}


export default function Index() {

  const router = useRouter();

  const [fields, setFields] = useState<Field[]>([]);
  const [submittedValues, setSubmittedValues] = useState<Field[]>([]);

  const handleAddField = () => {
    setFields([...fields, { property: '', value: '' }]);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleInputChange = (index: number, type: keyof Field, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index][type] = value;
    setFields(updatedFields);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedValues(fields);

    const transformedData: { [key: string]: string } = fields.reduce((acc: any, obj: any) => {
      acc[obj.property.trim()] = obj.value.trim();
      return acc;
    }, {});

    console.log('transformedData', transformedData);

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
        <div className='buyer-seller-form-wrapper full-width-template'>

          <div>
            <div className="header-content">
              <div>
                <Typography variant="h5" component="article">Create Template</Typography>
              </div>
              <div className="btn-wrapper">
                <Button variant="outlined" onClick={() => goToPage('/template')}>Back</Button>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent>
                <form className='form' onSubmit={handleSubmit}>

                  <TextField
                    type="text"
                    label="Name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    className="template-name-txt"
                  />

                  {fields.map((field, index) => (
                    <div className="template-form-wrapper" key={index}>
                      <div>
                        <TextField
                          type="text"
                          label="Label"
                          name="email"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={field.property}
                          placeholder="Property"
                          onChange={(e) => handleInputChange(index, 'property', e.target.value)}
                        />

                      </div>

                      <div>
                        <TextField
                          type="text"
                          label="Value"
                          name="address"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          multiline
                          rows={1}
                          value={field.value}
                          placeholder="Value"
                          onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                        />
                      </div>


                      <Button type='button' variant="contained" color="error" onClick={() => handleRemoveField(index)}>Remove</Button>

                    </div>
                  ))}

                  <div className="buyer-seller-forms-wrapper template-add-btn-wrapper">
                    <div></div>
                    <div>
                      <Button type='button' variant="contained" color="success" fullWidth onClick={handleAddField}>Add Label</Button>
                    </div>
                  </div>
                  <Button type='submit' variant="contained" fullWidth>Submit</Button>
                </form>

                <div>
                  <ul>
                    {submittedValues.map((field, index) => (
                      <li key={index}>
                        <Typography variant="body1"><b>{field.property}:</b> {field.value}</Typography>
                      </li>
                    ))}
                  </ul>
                </div>


              </CardContent>
            </Card>
          </div>

        </div>
      </Container>




    </>
  );
}


