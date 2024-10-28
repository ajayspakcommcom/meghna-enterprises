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

        console.log('contentData', contentData);
        console.log('buyerData', buyerData);
        console.log('sellerData', sellerData);

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
                    <DialogContent className="preview-dialogue-content">

                        <div className="preview-wrapper">
                            <div className="header">
                                <Image src={require(`../../public/images/seedsnfeeds.png`)} alt="seedsnfeeds" className="responsive-img center" />
                        </div>
                        
                        <div className="address">
                            <Typography variant="body2">504, SYNERGY, KACH PADA RD NO. 2, NEAR MALAD IND. ESTATE, RAMCHANDRA LANE EXTENTION, MALAD (W), MUMBAI - 400 064.</Typography>
                            <Typography variant="body2">Tel. : 022 2880 2452-Fax : 022 2881 5002</Typography>
                            <Typography variant="body2">Email : meghnaagencies@gmail.com</Typography>
                            <Typography variant="body2"><b>TAX-INVOICE</b></Typography>
                        </div>
                            

                             <table className="invoice-table">
                                <thead>
                                    <tr>
                                    <th>SAUDA DATE</th>
                                    <th>CONTRACT #</th>
                                    <th>BUYER/SELLER NAME</th>
                                    <th>COMMODITY</th>
                                    <th>QTY</th>
                                    <th>RATE/TON</th>
                                    <th>PER TON</th>
                                    <th>BROKERAGE AMOUNT (RS.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(3)].map((_, index) => (
                                    <tr key={index}>
                                        <td>31/05/2024</td>
                                        <td>MEC/L/00040/24-25</td>
                                        <td>SACHIN INTERNATIONAL PROTEINS PVT. LTD.</td>
                                        <td>SOYA EXT.</td>
                                        <td>200.000</td>
                                        <td>44100.00</td>
                                        <td>25.00</td>
                                        <td>5000.00</td>
                                    </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                    <td colSpan={3} className="amount-in-words-td">
                                        <span className="amount-in-words">AMOUNT IN WORD(S)</span>
                                        <p>RUPEES TWENTY THOUSAND SIX HUNDRED FIFTY ONLY.</p>
                                    </td>
                                    <td colSpan={4} className="totals">
                                        <table>
                                            <tbody>
                                                <tr><td>Total</td></tr>
                                                <tr><td>GST @18%</td></tr>
                                                <tr><td></td></tr>
                                                <tr><td>ROUNDOFF AMOUNT</td></tr>
                                                <tr><td>GRAND TOTAL</td></tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td className="totals-amount">
                                        <table>
                                        <tbody>
                                            <tr><td><b>17500.00</b></td></tr>
                                            <tr><td><b>3150.00</b></td></tr>
                                            <tr><td></td></tr>
                                            <tr><td><b>0.00</b></td></tr>
                                            <tr><td><b>20650.00</b></td></tr>
                                        </tbody>
                                        </table>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td colSpan={3} className="additional-info">
                                        <div>
                                        <div className="info-row">
                                            <span>PAN No</span><b>: AFRPC6408E</b>
                                        </div>
                                        <div className="info-row">
                                            <span>GSTIN</span><b>: 27AFRPC6408E1ZI</b>
                                        </div>
                                        </div>
                                    </td>
                                    <td colSpan={5} className="signature">
                                        <b>for MEGHNA ENTERPRISE</b>
                                        <br />
                                        <img src="http://localhost:3000/images/signature.jpg" alt="Signature" className="signature-img" />
                                        <br />
                                        <span>(AS BROKER)</span>
                                    </td>
                                    </tr>
                                </tfoot>
                                </table>

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