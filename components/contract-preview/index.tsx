import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Image from "next/image";
import { Typography } from "@mui/material";
import { customDateFormatter } from "@/services/common";

interface ContractPreviewProps {
    isOpen: boolean;
    heading: string;
    contentData?: any;
    onClick?: (val: boolean) => void,
}

const Index: React.FC<ContractPreviewProps> = ({ isOpen, heading, contentData, onClick }) => {

    const [open, setOpen] = React.useState(false);

    useEffect(() => {

        console.log('contentData', contentData);

        setOpen(isOpen);
    }, [isOpen]);


    const handleClose = () => {
        console.log('Ram');
        if (onClick) {
            onClick(false);
        }
        setOpen(false);
    };


    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="preview-dialogue"
            >
                {false && <DialogTitle id="alert-dialog-title">{heading}</DialogTitle>}

                {contentData &&
                    <DialogContent>
                        <div className="preview-wrapper">
                            <div className="header">
                                <Image src={require('../../public/images/logo.png')} alt="Description of the image" className="responsive-img center" />
                            </div>
                            <div className="address">
                                <Typography variant="body2">B-3 GIRIRAJ CO OP H S LTD, 6 MAMLATDAR WADI RAOD NO. 6 MALAD (WEST), MUMBAI - 400 064.</Typography>
                                <Typography variant="body2">PHONE NO: 022 2880 2452 | MOBILE NO: +91 99200 10200 / 99200 90200</Typography>
                                <Typography variant="body2">Email: | Pan No. AFRPC6408E </Typography>
                                <Typography variant="body2"><b>GSTIN: 27AFRPC6408E1ZI</b></Typography>
                            </div>

                            <div className="contract-box">
                                <div>
                                    <Typography variant="body2">
                                        <b>CONTRACT NO : </b> <b>{contentData.contract_no}</b>
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="body2">
                                        <b>DATE : </b> <b>{customDateFormatter(new Date())}</b>
                                    </Typography>
                                </div>
                            </div>

                            <div className="under-paragraph">
                                <Typography variant="body2">
                                    Under your instruction and order, we hereby confirm on behalf and risk of the under mentioned Seller and Buyer the following transaction with terms & conditions.
                                </Typography>
                            </div>


                            {/* Testing */}

                            <div className="detail-wrapper contract-detail-wrapper">

                                <div className="column"><Typography variant="body1" component="article"><b>Seller</b></Typography></div>
                                <div className="column"><Typography variant="body1" component="article"><span>{contentData.selectedSeller._id}</span></Typography></div>

                                <div className="column"><Typography variant="body1" component="article"><b>Buyer</b></Typography></div>
                                <div className="column"><Typography variant="body1" component="article"><span>{contentData.selectedBuyer._id}</span></Typography></div>


                                {Object.entries(contentData.selectedTemplate).filter(([key]) => key !== '_id' && key !== '__v' && key !== 'isDeleted' && key !== 'updatedDate' && key !== 'deletedDate' && key !== 'createdDate').map(([key, value]) => (
                                    <React.Fragment key={key}>
                                        <div className="column"><Typography variant="body1" component="article"><b>{key.charAt(0).toUpperCase() + key.slice(1)}</b></Typography></div>
                                        <div className="column"><Typography variant="body1" component="article"><span>{value as string}</span></Typography></div>
                                    </React.Fragment>
                                ))}

                                <div className="column"><Typography variant="body1" component="article"><b>Quantity</b></Typography></div>
                                <div className="column"><Typography variant="body1" component="article"><span>{contentData.formikValues.quantity}</span></Typography></div>

                                <div className="column"><Typography variant="body1" component="article"><b>Price</b></Typography></div>
                                <div className="column"><Typography variant="body1" component="article"><span>{contentData.formikValues.price}</span></Typography></div>

                                {Object.entries(contentData.labelFields).filter(([key]) => key !== '_id' && key !== '__v' && key !== 'isDeleted' && key !== 'updatedDate' && key !== 'deletedDate' && key !== 'createdDate').map(([key, value]) => (
                                    <React.Fragment key={key}>
                                        <div className="column"><Typography variant="body1" component="article"><b>{key.charAt(0).toUpperCase() + key.slice(1)}</b></Typography></div>
                                        <div className="column"><Typography variant="body1" component="article"><span>{value as string}</span></Typography></div>
                                    </React.Fragment>
                                ))}



                            </div>

                            {/* Testing  */}


                            <div className="footer-subject">
                                <Typography variant="body2">
                                    Subject to Mumbai Jurisdiction
                                </Typography>
                            </div>

                            <div className="footer-seed-feed">
                                <Typography variant="body2">
                                    <b>For SEEDS & FEEDS INDIA</b>
                                </Typography>
                            </div>

                            <div className="footer-buyer-seller">
                                <div>
                                    <Typography variant="body2"><b>FOR SELLER</b></Typography>
                                </div>
                                <div>
                                    <Typography variant="body2"><b>FOR BUYER</b></Typography>
                                </div>
                            </div>

                        </div>


                        {/* {JSON.stringify(contentData)} */}
                    </DialogContent>
                }

                <DialogActions>
                    <Button onClick={handleClose}>Ok</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default React.memo(Index);