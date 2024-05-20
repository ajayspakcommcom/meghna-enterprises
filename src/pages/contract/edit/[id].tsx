import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container, Autocomplete, Select } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Contract from "../../../../models/Contract";
import { useFormik } from "formik";
import ErrorMessage from "../../../../components/error-message";
import contractSchema from "@/validation/contractSchema";
import { getSellerIdName } from "@/services/seller";
import { getBuyerIdName } from "@/services/buyer";
import { getTemplate, getTemplateIdName } from "@/services/template";
import { createContract, getContract, getLastContract, updateContract } from "@/services/contract";
import { getCurrentFinancialYear, incrementContractNo } from "@/services/common";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const Header = dynamic(() => import('../../../../components/header/index'));
const SuccessConfirmationDialogue = dynamic(() => import('../../../../components/success-confirmation/index'));
const ContractPreviewDialogue = dynamic(() => import('../../../../components/contract-preview/index'));

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

interface compProps {
  detail: { data: any };
}

interface DetailData {
  _id: string;
  contract_no: string;
  buyer_id: any;
  seller_id: any;
  template: any;
  label: { [key: string]: string; };
  quantity: number;
  price: number;
  assessment_year: string;
  updatedDate: string | null;
  deletedDate: string | null;
  isDeleted: boolean;
  createdDate: string;
  template_id: string;
  __v: number;
}



const Index: React.FC<compProps> = ({ detail }) => {

  const router = useRouter();

  const detailedData = detail.data as DetailData;


  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<any>();

  const [selectedSeller, setSelectedSeller] = useState<selectedAutoField | null>({ _id: detailedData.seller_id._id, label: detailedData.seller_id.name });
  const [selectedBuyer, setSelectedBuyer] = useState<selectedAutoField | null>({ _id: detailedData.buyer_id._id, label: detailedData.buyer_id.name });
  const [selectedTemplate, setSelectedTemplate] = useState<selectedAutoField | null>({ _id: '', label: '' });

  const [quantityInput, setQuantityInput] = useState<any>();
  const [priceInput, setPriceInput] = useState<any>();

  const [sellerList, setSellerList] = useState<any[]>([]);
  const [buyerList, setBuyerList] = useState<any[]>([]);
  const [templateList, setTemplateList] = useState<any[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [labelFields, setLabelFields] = useState<LabelField[]>([]);
  const [contractNo, setContractNo] = useState<any>();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>();


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
    console.log('Selected Seller : ', value);
    setSelectedSeller(value);
  };

  const handleBuyerChange = (event: React.ChangeEvent<{}>, value: selectedAutoField | null) => {
    setSelectedBuyer(value);
  };

  const handleTemplateChange = async (event: React.ChangeEvent<{}>, value: selectedAutoField | null) => {
    console.log('Selected Template : ', value);
    setFields([]);
    try {
      const templateId = value?._id ?? '';
      const response: any = await getTemplate(templateId);
      const label = response.data.label;
      const newFields = Object.keys(label).map(key => ({ property: key, value: label[key] }));
      setFields(prevFields => [...prevFields, ...newFields]);
    } catch (error) {
      console.log('Error : ', error);
    }
    setSelectedTemplate(value);
  };

  const handleInputChange = (index: number, type: keyof Field, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index][type] = value;
    setFields(updatedFields);
  };


  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }


    const fetchLastContract = async () => {
      try {
        const response: any = await getLastContract();
        setContractNo(incrementContractNo(response.data.contract_no, getCurrentFinancialYear(true)))
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

    const fetchTemplateDetailById = async () => {
      setFields([]);
      try {
        const response: any = (await getTemplate(detailedData.template_id)).data;
        console.log('Response : ', response);
        setSelectedTemplate({ _id: detailedData.template_id, label: response.name })

        const newFields = Object.keys(detailedData.template).map(key => ({ property: key, value: detailedData.template[key] }));
        setFields(prevFields => [...newFields]);

      } catch (error) {
        console.error('Error fetching template data:', error);
      }
    };


    fetchLastContract();
    fetchSellerIdName();
    fetchBuyerIdName();
    fetchTemplateIdName();
    fetchTemplateDetailById();

    console.log('Data : ', detail.data);

    formik.setValues({
      quantity: detailedData.quantity.toString(),
      price: detailedData.price.toString(),
    });



  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  const initialValues: Contract = {
    quantity: '',
    price: ''
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
      contract_no: contractNo,
      buyer_id: selectedBuyer?._id,
      seller_id: selectedSeller?._id,
      template: transformedFeildData,
      label: transformedLabelFeildData,
      assessment_year: getCurrentFinancialYear(),
      template_id: selectedTemplate?._id,
      id: detailedData._id
    };

    console.log('submittedData', submittedData);

    setLoading(true);
    try {
      const response = await updateContract(submittedData);
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
      contract_no: contractNo,
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

  return (
    <>
      <Header />

      <Container maxWidth="xl">
        <div className='buyer-seller-form-wrapper'>

          <div>
            <div className="header-content">
              <div>
                <Typography variant="h5" component="article">Edit Contract</Typography>
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
                      <Autocomplete
                        disablePortal
                        options={sellerList}
                        renderInput={(params) => <TextField {...params} label="Seller" required />}
                        onChange={handleSellerChange}
                        value={selectedSeller}
                      />
                    </div>
                    <div>
                      <Autocomplete
                        disablePortal
                        options={buyerList}
                        renderInput={(params) => <TextField {...params} label="Buyer" required />}
                        onChange={handleBuyerChange}
                        value={selectedBuyer}
                      />
                    </div>
                  </div>

                  <div className="buyer-seller-forms-wrapper contract-form-wrapper template">
                    <div>
                      <Autocomplete
                        disablePortal
                        options={templateList}
                        renderInput={(params) => <TextField {...params} label="Template" required />}
                        onChange={handleTemplateChange}
                        value={selectedTemplate}
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

                  <div className="buyer-seller-forms-wrapper contract-form-wrapper">
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
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        error={formik.touched.price && Boolean(formik.errors.price)}
                        helperText={formik.touched.price && formik.errors.price}
                      />
                    </div>
                  </div>

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
                    <div>
                      <Button type='button' variant="contained" color="success" fullWidth onClick={handleAddLabelField}>Add Heading</Button>
                    </div>
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

      <SuccessConfirmationDialogue isOpen={isSuccessDialogOpen} heading="Contract Updated Successfully" />
      <ContractPreviewDialogue isOpen={isPreviewDialogOpen} heading="Contract Preview" contentData={previewContent} onClick={previewClickHandler} />

    </>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const { id } = context.query;
  const detail = await getContract(id as string);

  return {
    props: { detail }
  };

};


