import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container, Autocomplete, Select, InputAdornment } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Contract from "../../../models/Contract";
import { useFormik } from "formik";
import ErrorMessage from "../../../components/error-message";
import contractSchema from "@/validation/contractSchema";
import { getSellerIdName } from "@/services/seller";
import { getBuyerIdName } from "@/services/buyer";
import { getTemplate, getTemplateIdName } from "@/services/template";
import { createContract, getLastContract } from "@/services/contract";
import { debounceContractNoCheck, getCurrentFinancialYear, getLocalStorage, incrementContractNo } from "@/services/common";



const Header = dynamic(() => import('../../../components/header/index'));
const SuccessConfirmationDialogue = dynamic(() => import('../../../components/success-confirmation/index'));
const ContractPreviewDialogue = dynamic(() => import('../../../components/contract-preview/index'));

interface selectedAutoField {
  label: string;
  _id: string;
}

interface Field {
  property: string;
  value: string;
}

interface LabelField {
  property: string;
  value: string;
}

export default function Index() {

  const router = useRouter();

  const [authData, setAuthData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<any>();

  const [selectedSeller, setSelectedSeller] = useState<selectedAutoField | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<selectedAutoField | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<selectedAutoField | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>('');

  const [sellerList, setSellerList] = useState<any[]>([]);
  const [buyerList, setBuyerList] = useState<any[]>([]);
  const [templateList, setTemplateList] = useState<any[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [labelFields, setLabelFields] = useState<LabelField[]>([]);
  const [contractNo, setContractNo] = useState<any>();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>();
  const [isContractNoExists, setIsContractNoExists] = useState(false);

  const handleAddLabelField = () => {
    setLabelFields([...labelFields, { property: '', value: '' }]);
  };

  const handleRemoveField = (index: number) => {
    const updatedLabelFields = [...labelFields];
    updatedLabelFields.splice(index, 1);
    setLabelFields(updatedLabelFields);
  };

  const handleLabelInputChange = (index: number, type: keyof Field, value: string) => {
    const updatedLabelFields = [...labelFields];
    updatedLabelFields[index][type] = value;
    setLabelFields(updatedLabelFields);
  };

  const handleSellerChange = (event: React.ChangeEvent<{}>, value: selectedAutoField | null) => {
    setSelectedSeller(value);
  };

  const handleBuyerChange = (event: React.ChangeEvent<{}>, value: selectedAutoField | null) => {
    setSelectedBuyer(value);
  };

  const handleTemplateChange = async (event: React.ChangeEvent<{}>, value: selectedAutoField | null) => {

    setSelectedTemplateId(value?._id)

    setFields([]);
    try {
      const templateId = value?._id ?? '';
      const response: any = await getTemplate(templateId);
      const label = response.data.label;

      const newFields = Object.keys(label).map(key => ({ property: key, value: label[key] }));

      setFields(prevFields => [...prevFields, ...newFields]);
    } catch (error) {      
    }
    setSelectedTemplate(value);
  };

  const handleInputChange = (index: number, type: keyof Field, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index][type] = value;
    setFields(updatedFields);
  };


  useEffect(() => {

    formik.setFieldValue('createdDate', new Date().toISOString().split('T')[0]);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }


    const fetchLastContract = async () => {
      try {
        const response: any = await getLastContract();
        if (response.data !== null) {
          setContractNo(incrementContractNo(response.data.contract_no, getCurrentFinancialYear(true)))
          formik.setFieldValue('contract_no', incrementContractNo(response.data.contract_no, getCurrentFinancialYear(true)));
        } else {
          setContractNo(incrementContractNo('', getCurrentFinancialYear(true)));
          formik.setFieldValue('contract_no', incrementContractNo('', getCurrentFinancialYear(true)));
        }
      } catch (error) {
        console.error('Error fetching seller data:', error);
      }
    };

    const fetchSellerIdName = async () => {
      try {
        const response = await getSellerIdName();
        const formattedData = response.data.map((seller: any) => {
          const output = { ...seller, label: seller.name }
          delete output.name;
          return output;
        });
        setSellerList(formattedData);
      } catch (error) {
        console.error('Error fetching seller data:', error);
      }
    };

    const fetchBuyerIdName = async () => {
      try {
        const response = await getBuyerIdName();
        const formattedData = response.data.map((buyer: any) => {
          const output = { ...buyer, label: buyer.name }
          delete output.name;
          return output;
        });
        setBuyerList(formattedData);
      } catch (error) {
        console.error('Error fetching buyer data:', error);
      }
    };

    const fetchTemplateIdName = async () => {
      try {
        const response = await getTemplateIdName();
        const formattedData = response.data.map((buyer: any) => {
          const output = { ...buyer, label: buyer.name }
          delete output.name;
          return output;
        });
        setTemplateList(formattedData);
      } catch (error) {
        console.error('Error fetching template data:', error);
      }
    };

    fetchLastContract();
    fetchSellerIdName();
    fetchBuyerIdName();
    fetchTemplateIdName();

  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  const initialValues: Contract = {
    quantity: '',
    price: '',
    contract_no: '',
    createdDate: new Date().toISOString().split('T')[0],
  };

  const handleSubmit = async (contract: Contract) => {

    const transformedFeildData: { [key: string]: string } = fields.reduce((acc: any, obj: any) => {
      acc[obj.property.trim()] = obj.value.trim();
      return acc;
    }, {});

    const transformedLabelFeildData: { [key: string]: string } = labelFields.reduce((acc: any, obj: any) => {
      acc[obj.property.trim()] = obj.value.trim();
      return acc;
    }, {});

    const submittedData = {
      ...contract,
      contract_no: formik.values.contract_no,
      buyer_id: selectedBuyer?._id,
      seller_id: selectedSeller?._id,
      template: transformedFeildData,
      label: transformedLabelFeildData,
      assessment_year: getCurrentFinancialYear(),
      template_id: selectedTemplateId,
      company: getLocalStorage('appLogo') ? getLocalStorage('appLogo') : '',
      createdDate: formik.values.createdDate
    };

    setLoading(true);
    try {
      const response = await createContract(submittedData);
      setLoading(false);
      formik.resetForm();
      setIsSuccessDialogOpen(true);
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }

  };

  const handleReset = () => {
    formik.setValues(initialValues);
    formik.setErrors({});
  };

  const formik = useFormik({
    initialValues,
    validationSchema: contractSchema,
    onSubmit: handleSubmit,
    onReset: handleReset
  });

  const previewHandler = () => {

    setIsPreviewDialogOpen(true);

    const transformedFeildData: { [key: string]: string } = fields.reduce((acc: any, obj: any) => {
      acc[obj.property.trim()] = obj.value.trim();
      return acc;
    }, {});

    const transformedLabelFeildData: { [key: string]: string } = labelFields.reduce((acc: any, obj: any) => {
      acc[obj.property.trim()] = obj.value.trim();
      return acc;
    }, {});

    let previewData = {
      contract_no: formik.values.contract_no,
      selectedSeller: selectedSeller,
      selectedBuyer: selectedBuyer,
      selectedTemplate: transformedFeildData,
      labelFields: transformedLabelFeildData,
      formikValues: formik.values
    };

    setPreviewContent(previewData);
  };

  const previewClickHandler = (val: boolean) => {
    setIsPreviewDialogOpen(val)
  };

  const handleContractNoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('contract_no', event.target.value);
    const contractNo = await debounceContractNoCheck(event.target.value);    
    if (contractNo?.data) {            
      setIsContractNoExists(true);
    } else {      
      setIsContractNoExists(false);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
    formik.setFieldValue('createdDate', event.target.value);
  };

  return (
    <>
      <Header />

      <Container maxWidth="xl">
        <div className='buyer-seller-form-wrapper'>

          <div>
            <div className="header-content">
              <div>
                <Typography variant="h5" component="article">Create Contract</Typography>
              </div>
              <div className="btn-wrapper">
                <Button variant="outlined" onClick={() => goToPage('/contract')}>Back</Button>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent>
                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className='form'>
                  {errors && <div className="error"><ErrorMessage message={errors} /></div>}

                  <div className="buyer-seller-forms-wrapper contract-form-wrapper">
                    <div>
                        <TextField
                          type="text"
                          label="Contract No"
                          name="contract_no"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={formik.values.contract_no}
                          onChange={handleContractNoChange}
                          error={formik.touched.contract_no && Boolean(formik.errors.contract_no)}
                          helperText={ isContractNoExists && <span style={{ color: 'red' }}>Contract No already exists.</span>}
                        />
                    </div>
                    <div>
                      <TextField
                          type="date"
                          label="Date"
                          name="createdDate"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={formik.values.createdDate}
                          onChange={handleDateChange}                          
                        />
                    </div>
                  </div>
                  

                  <div className="buyer-seller-forms-wrapper contract-form-wrapper">
                    <div>
                      <Autocomplete
                        disablePortal
                        options={sellerList}
                        renderInput={(params) => <TextField {...params} label="Seller" required />}
                        onChange={handleSellerChange}
                      />
                    </div>
                    <div>
                      <Autocomplete
                        disablePortal
                        options={buyerList}
                        renderInput={(params) => <TextField {...params} label="Buyer" required />}
                        onChange={handleBuyerChange}
                      />
                    </div>
                  </div>

                  {/* <div className="buyer-seller-forms-wrapper contract-form-wrapper">
                    <div>
                      <TextField
                        type="text"
                        label="Quantity"
                        name="quantity"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                        helperText={formik.touched.quantity && formik.errors.quantity}
                      />
                    </div>
                    <div>
                      <TextField
                        type="text"
                        label="Price"
                        name="price"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={1}
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        error={formik.touched.price && Boolean(formik.errors.price)}
                        helperText={formik.touched.price && formik.errors.price}
                      />
                    </div>
                  </div> */}

                  <TextField
                    type="text"
                    label="Quantity"
                    name="quantity"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                  />

                  <div className="multiline">
                    <TextField
                      type="text"
                      label="Price"
                      name="price"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={2}
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      error={formik.touched.price && Boolean(formik.errors.price)}
                      helperText={formik.touched.price && formik.errors.price}
                      InputProps={{startAdornment: <InputAdornment position="start" className="adornmentPrefix">Rs</InputAdornment>}}
                    />
                  </div>


                  <div className="buyer-seller-forms-wrapper contract-form-wrapper template">
                    <div>
                      <Autocomplete
                        disablePortal
                        options={templateList}
                        renderInput={(params) => <TextField {...params} label="Template" required />}
                        onChange={handleTemplateChange}
                      />
                    </div>
                  </div>

                  {fields.map((field, index) => (
                    <div className="template-form-wrapper contract-form-wrapper" key={index}>
                      <div>
                        <TextField
                          type="text"
                          label="Label"
                          name="email"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          multiline
                          rows={3}
                          value={field.property}
                          placeholder="Property"
                          onChange={(e) => handleInputChange(index, 'property', e.target.value)}
                          disabled
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
                    </div>
                  ))}



                  {labelFields.map((field, index) => (
                    <div className="template-form-wrapper contract-form-wrapper" key={index}>
                      <div>
                        <TextField
                          type="text"
                          label="Heading"
                          name="property"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={field.property}
                          placeholder="Property"
                          onChange={(e) => handleLabelInputChange(index, 'property', e.target.value)}
                        />
                      </div>

                      <div>
                        <TextField
                          type="text"
                          label="Value"
                          name="value"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          multiline
                          rows={1}
                          value={field.value}
                          placeholder="Value"
                          onChange={(e) => handleLabelInputChange(index, 'value', e.target.value)}
                        />
                      </div>

                      <Button type='button' variant="contained" color="error" onClick={() => handleRemoveField(index)} className="remove-btn">Remove</Button>

                    </div>
                  ))}

                  <div className="template-form-wrapper contract-form-btn">
                    <div>
                      <div>
                        <Button type='button' variant="outlined" fullWidth onClick={() => previewHandler()}>Preview</Button>
                      </div>
                    </div>
                    {/* <div>
                      <Button type='button' variant="contained" color="success" fullWidth onClick={handleAddLabelField} className="add-heading">Add Heading</Button>
                    </div> */}
                  </div>

                  <Button type='submit' variant="contained" fullWidth>{loading ? "Submit..." : "Submit"}</Button>

                  {/* <div className="contract-btn-wrapper">
                    <div>
                      <Button type='button' variant="outlined" fullWidth>{'Preview'}</Button>
                    </div>
                    <div>
                      <Button type='submit' variant="contained" fullWidth>{loading ? "Submit..." : "Submit"}</Button>
                    </div>
                  </div> */}
                </form>


              </CardContent>
            </Card>
          </div>

        </div>
      </Container>

      <SuccessConfirmationDialogue isOpen={isSuccessDialogOpen} heading="Contract Created Successfully" redirect="contract" />
      <ContractPreviewDialogue isOpen={isPreviewDialogOpen} heading="Contract Preview" contentData={previewContent} onClick={previewClickHandler} />

    </>
  );
}


