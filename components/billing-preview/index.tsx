import React, { useState, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Image from "next/image";
import { Typography } from "@mui/material";
import { customDateFormatter, customFormatDate, getLocalStorage, numberToIndianWords } from "@/services/common";
import { getBuyer } from "@/services/buyer";
import { getSeller } from "@/services/seller";
//const converter = require('number-to-words');
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

    const pdfRef = useRef<HTMLDivElement>(null); 

    const generatePdf = async () => {      
    const element = (pdfRef.current as HTMLDivElement);
    // Use html2canvas to take a screenshot of the HTML element
    const canvas = await html2canvas(element, {scale: 5});
    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    // Create a new jsPDF instance
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const imgWidth = pageWidth - 10;; // PDF width in mm
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;    
    
    const xOffset = (pageWidth - imgWidth) / 2;

    // Add the image to the PDF
    pdf.addImage(imgData, 'JPEG', xOffset, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // If the image height is larger than a single page, add new pages
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', xOffset, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    // Save the PDF
    pdf.save('billing.pdf');
  };

    const fetchPartyData = async () => {        
        const partyData = contentData?.partyType.toLowerCase() === 'buyer' ? await getBuyer(contentData.partyId) : await getSeller(contentData.partyId);
        const respData = (partyData as any).data;
        contentData?.partyType.toLowerCase() === 'buyer' ? setBuyerData(respData) : setSellerData(respData);            
    };

    useEffect(() => {

        if (contentData) {            
            fetchPartyData();        
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

                        <div className="preview-wrapper" ref={pdfRef}>
                            <div className="header"><Image src={require(`../../public/images/seedsnfeeds.png`)} alt="seedsnfeeds" className="responsive-img center" /></div>
                        
                        <div className="address">
                            <Typography variant="body2">504, SYNERGY, KACH PADA RD NO. 2, NEAR MALAD IND. ESTATE, RAMCHANDRA LANE EXTENTION, MALAD (W), MUMBAI - 400 064.</Typography>
                            <Typography variant="body2">Tel. : 022 2880 2452-Fax : 022 2881 5002</Typography>
                            <Typography variant="body2">Email : kashyap.seedsnfeeds@gmail.com</Typography>
                            <Typography variant="body2"><b>TAX-INVOICE</b></Typography>
                        </div>
                            
                        <div className="bill-no-date-wrapper">
                                <div>
                                    <span>BILL NO.</span>
                                <b>: {contentData.billingNo}</b>
                                </div>
                                <div>
                                <span>DATE</span>
                                    <b>: {customFormatDate(new Date(contentData.billingDate))}</b>
                                </div>
                        </div>
                        
                        
                        {buyerData && <div className="company-info">
                            <p className="company-name"><b>{buyerData.name}</b></p>
                                <div className="company-address">
                                    <p className="address-text">
                                        {buyerData.address}
                                    </p>
                                    <div className="gst-info">
                                    <div className="info-row">
                                        <p className="info-label">PARTY'S GSTIN</p>
                                        <p>: {buyerData.gstin}</p>
                                    </div>
                                    <div className="info-row">
                                        <p className="info-label">PARTY'S STATE CODE</p>
                                        <p>: {buyerData.state_code}</p>
                                    </div>
                                    </div>
                                </div>
                        </div>}


                        {sellerData && <div className="company-info">
                            <p className="company-name"><b>{sellerData.name}</b></p>
                                <div className="company-address">
                                    <p className="address-text">
                                        {sellerData.address}
                                    </p>
                                    <div className="gst-info">
                                    <div className="info-row">
                                        <p className="info-label">PARTY'S GSTIN</p>
                                        <p>: {sellerData.gstin}</p>
                                    </div>
                                    <div className="info-row">
                                        <p className="info-label">PARTY'S STATE CODE</p>
                                        <p>: {sellerData.state_code}</p>
                                    </div>
                                    </div>
                                </div>
                        </div>}
                        

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
                                    {contentData?.contracts.map((contract: any, index: number) => (
                                    <tr key={index}>
                                        <td>{customFormatDate(new Date(contract.createdDate))}</td>
                                        <td>{contract.contractNo}</td>
                                        <td>{contentData.name}</td>
                                        <td>{contract.templateName}</td>
                                        <td>{contract.quantity}</td>
                                        <td>{contract.price}</td>
                                        <td>{contract.brokerageQty}</td>
                                        <td>{contract.brokerageAmt}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                    <td colSpan={3} className="amount-in-words-td">
                                        <span className="amount-in-words">AMOUNT IN WORD(S)</span>                                        
                                        <p>Rupees {numberToIndianWords(contentData?.grandTotalAmt)}</p>
                                    </td>
                                    <td colSpan={4} className="totals">
                                        <table>
                                            <tbody>
                                                <tr><td>Total</td></tr>
                                                <tr>
                                                    <td>
                                                        {contentData?.cgst > 0 && `CGST @${contentData.cgst}%,`}
                                                        {contentData?.sgst > 0 && `SGST @${contentData.sgst}% ${contentData.igst > 0 ? ',' : ''} `}
                                                        {contentData?.igst > 0 && `IGST @${contentData.igst}%`}                                                        
                                                    </td>
                                                </tr>
                                                <tr><td></td></tr>
                                                <tr><td>ROUNDOFF AMOUNT</td></tr>
                                                <tr><td>GRAND TOTAL</td></tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td className="totals-amount">
                                        <table>
                                        <tbody>
                                            <tr><td><b>{contentData?.netAmount}</b></td></tr>
                                            <tr><td><b>{contentData?.brokerage}</b></td></tr>
                                            <tr><td></td></tr>
                                            <tr><td><b>0.00</b></td></tr>
                                            <tr><td><b>{contentData?.grandTotalAmt}</b></td></tr>
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
                                        <b>for Seeds & Feeds Vyanah</b>
                                        <br />
                                        <Image src={require(`../../public/images/signature.jpg`)} alt="Signature" className="signature-img" />                                        
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
                    <div className="preview-pop-ok-btn billing-preview-pop">
                    <Button variant="outlined" onClick={() => generatePdf()}>Download Pdf</Button>
                    <Button onClick={handleClose} variant="outlined" fullWidth>Close</Button>
                    </div>
                </DialogActions>
            </Dialog>        
    );
}

export default React.memo(Index);