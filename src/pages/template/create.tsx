import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container, Autocomplete } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { createTemplate } from "@/services/template";
import ErrorMessage from "../../../components/error-message";
import SuccessMessage from "../../../components/success-message";
import { brokerageLiabilityText, brokerageText, commodityText, paymentText, periodOfDeliveryText, placeOfDeliveryText, termsConditionText } from "@/services/text-content";

const Header = dynamic(() => import('../../../components/header/index'));
const SuccessConfirmationDialogue = dynamic(() => import('../../../components/success-confirmation/index'));


interface Field {
  property: string;
  value: string;
}


interface selectedAutoField {
  label: string;
  _id: string;
}

const headings = [
  { label: 'COMMODITY' },
  { label: 'PLACE OF DELIVERY' },
  { label: 'PERIOD OF DELIVERY' },
  { label: 'PAYMENT' },
  { label: 'TERMS & CONDITIONS' },
  { label: "BROKERAGE LIABILITY" },
  { label: 'BROKERAGE' }
];


export default function Index() {

  const router = useRouter();


  const [fields, setFields] = useState<Field[]>([]);
  const [submittedValues, setSubmittedValues] = useState<Field[]>([]);
  const [name, setName] = useState('');

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<any>();
  const [success, setSuccess] = useState<any>();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);


  const handleDropdownChange = (index: any, type: keyof Field, event: React.ChangeEvent<{}>) => {
    const updatedFields = [...fields];
    updatedFields[index][type] = (event.target as HTMLElement).textContent!;

    let selectedProperty: string | null = (event.target as HTMLElement).textContent;
    let inputFieldValue: string | null = '';

    switch (selectedProperty?.trim().toLocaleLowerCase()) {
      case "commodity":
        inputFieldValue = commodityText;
        break;
      case "place of delivery":
        inputFieldValue = placeOfDeliveryText;
        break;
      case "period of delivery":
        inputFieldValue = periodOfDeliveryText;
        break;
      case "payment":
        inputFieldValue = paymentText;
        break;
      case "terms & conditions":
        inputFieldValue = termsConditionText;
        break;
      case "brokerage liability":
        inputFieldValue = brokerageLiabilityText;
        break;
      case "brokerage":
        inputFieldValue = brokerageText;
        break;
      default:
        inputFieldValue = '';
    }

    updatedFields[index]['value'] = inputFieldValue;
    setFields(updatedFields);

  };


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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {

    setLoading(true);

    event.preventDefault();
    setSubmittedValues(fields);

    const transformedData: { [key: string]: string } = fields.reduce((acc: any, obj: any) => {
      acc[obj.property.trim()] = obj.value.trim();
      return acc;
    }, {});

    const finalObject = {
      label: transformedData,
      name: name.trim()
    };

    console.log('finalObject', finalObject);

    try {
      const response = await createTemplate(finalObject);
      setLoading(false);
      setSuccess('Template created successfully');
      setTimeout(() => {
        setSuccess(null)
      }, 2000);
      setIsSuccessDialogOpen(true);

    } catch (error: any) {

      setLoading(false);
      console.error('Error saving:', error);
      setError(error.response.data.errorDetail);

      setTimeout(() => {
        setError(null)
      }, 2000);
    }

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

                {errors && <div className="error"><ErrorMessage message={errors} /></div>}
                {success && <div className="success"><SuccessMessage message={success} /></div>}

                <form className='form' onSubmit={handleSubmit}>

                  <TextField
                    type="text"
                    label="Name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    className="template-name-txt"
                    onChange={handleChange}
                  />

                  {fields.map((field, index) => (
                    <div className="template-form-wrapper" key={index}>
                      <div>

                        <Autocomplete
                          disablePortal
                          options={headings}
                          sx={{ width: 300 }}
                          renderInput={(params) => <TextField {...params} label="Heading" />}
                          onChange={(e) => handleDropdownChange(index, 'property', e)}
                          className="template-dropdown"
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
                          rows={3}
                          value={field.value}
                          placeholder="Value"
                          onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                        />
                      </div>


                      <Button type='button' variant="contained" color="error" onClick={() => handleRemoveField(index)} className="remove-btn">Remove</Button>

                    </div>
                  ))}

                  <div className="buyer-seller-forms-wrapper template-add-btn-wrapper">
                    <div></div>
                    <div>
                      <Button type='button' variant="contained" color="success" fullWidth onClick={handleAddField}>Add Label</Button>
                    </div>
                  </div>
                  <Button type='submit' variant="contained" fullWidth>{loading ? "Submit..." : "Submit"}</Button>
                </form>


              </CardContent>
            </Card>
          </div>

        </div>
      </Container>

      <SuccessConfirmationDialogue isOpen={isSuccessDialogOpen} heading="Template Created Successfully" />




    </>
  );
}


