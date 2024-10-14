import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Image from "next/image";
import { Typography } from "@mui/material";
import { customFormatDate, getLocalStorage } from "@/services/common";
import { getBuyer } from "@/services/buyer";
import { getSeller } from "@/services/seller";

interface BillingPreviewProps {
    isOpen: boolean;
    heading: string;
    contentData?: any;
    onClick?: (val: boolean) => void,
}

const Index: React.FC<BillingPreviewProps> = ({ isOpen, heading, contentData, onClick }) => {

    const [open, setOpen] = React.useState(false);

    const [buyerData, setBuyerData] = React.useState<any>();
    const [sellerData, setSellerData] = React.useState<any>();
    const [logo, setLogo] = React.useState<string | null>('');

    const fetchBuyerData = async () => {
            const resp: any = await getBuyer(contentData.selectedBuyer._id as string);
            setBuyerData(resp.data);
        };

    const fetchSellerData = async () => {
        const resp: any = await getSeller(contentData.selectedSeller._id as string);
        setSellerData(resp.data);
    };

    useEffect(() => {

        if (contentData) {
            if (contentData.selectedBuyer !== null && contentData.selectedBuyer !== undefined) {
                fetchBuyerData();
                fetchSellerData();
            }
        }

        if (getLocalStorage('appLogo')) {
            setLogo(getLocalStorage('appLogo'))
        }

        setOpen(isOpen);
    }, [isOpen, logo]);


    const handleClose = () => {
        onClick?.(false);
        setOpen(false);
    };


    return (        
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
                                <Image src={require(`../../public/images/logo.svg`)} alt="Description of the image" className="responsive-img center" />
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
                                        <b>Billing No : </b> <b>{contentData.billingNo}</b>
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="body2">
                                        <b>DATE : </b> <b>{customFormatDate(contentData.billDate ? new Date(contentData.billDate) : new Date())}</b>
                                    </Typography>
                                </div>
                            </div>

                            <div className="under-paragraph">
                                <Typography variant="body2">
                                    Under your instruction and order, we hereby confirm on behalf and risk of the under mentioned Seller and Buyer the following transaction with terms & conditions.
                                </Typography>
                        </div>
                        
                            <div className="detail-wrapper contract-detail-wrapper">
                                {contentData.contractReferenceNo &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>Contract Reference No</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.contractReferenceNo}
                                                </Typography>
                                            </div>
                                        </>
                            }
                            
                            {contentData.billDate &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>Bill Date</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.billDate}
                                                </Typography>
                                            </div>
                                        </>
                            }
                            
                            {contentData.buyer &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>Buyer</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.buyer}
                                                </Typography>
                                            </div>
                                        </>
                            }
                            
                            {contentData.seller &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>Seller</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.seller}
                                                </Typography>
                                            </div>
                                        </>
                            }
                            
                            {contentData.quantity &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>Quantity</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.quantity}
                                                </Typography>
                                            </div>
                                        </>
                                }

                            
                            {contentData.price &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>Price</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.price}
                                                </Typography>
                                            </div>
                                        </>
                            }
                            
                            {contentData.brokeragePrice &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>Brokerage Price</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.brokeragePrice}
                                                </Typography>
                                            </div>
                                        </>
                            }
                            
                            {contentData.brokerageOn &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>Brokerage On</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.brokerageOn}
                                                </Typography>
                                            </div>
                                        </>
                            }
                            
                            {contentData.sgst &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>SGST</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.sgst}
                                                </Typography>
                                            </div>
                                        </>
                            }
                            
                            {contentData.cgst &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>CGST</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.cgst}
                                                </Typography>
                                            </div>
                                        </>
                            }
                            
                            {contentData.igst &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>IGST</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.igst}
                                                </Typography>
                                            </div>
                                        </>
                            }
                            
                            {contentData.brokerageAmount &&
                                        <>
                                            <div className="column"><Typography variant="body1" component="article"><b>Brokerage Amount</b></Typography></div>
                                            <div className="column">
                                                <Typography variant="body2" component="article">                                                   
                                                    {contentData.brokerageAmount}
                                                </Typography>
                                            </div>
                                        </>
                            }

                            </div>


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

                            <div className="footer-seed-feed">
                                <Typography variant="body2">
                                    <b>(AS BROKER)</b>
                                </Typography>
                            </div>

                        </div>

                    </DialogContent>
                }

                <DialogActions>
                    <div className="preview-pop-ok-btn">
                        <Button onClick={handleClose} variant="outlined" fullWidth>Ok</Button>
                    </div>
                </DialogActions>
            </Dialog>        
    );
}

export default React.memo(Index);