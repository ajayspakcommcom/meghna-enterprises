import { convertHtmlToPdf } from "@/services/billing";
import React, { useEffect, useState } from "react";

const htmlContent = `
   <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Billing Invoice</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">

    <div
        style="max-width: 1200px; margin: auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #333; background-color: #c0c0c0; margin: auto; padding: 10px 0;">MEGHNA
            ENTERPRISE</h2>

        <div style="width: 600px; margin: auto; margin-top: 10px; margin-bottom: 10px;">
            <p style="text-align: center; font-size: 12px; margin: 0 0 10px 0; line-height: 20px; font-weight: 300;">
                504, SYNERGY, KACH PADA RD NO. 2, NEAR MALAD IND. ESTATE, RAMCHANDRA LANE EXTENTION, MALAD (W),
                MUMBAI - 400 064
            </p>

            <p style="text-align: center; font-size: 12px; margin: 0; line-height: 20px; font-weight: 300;">
                Tel. : 022 2880 2452-Fax : 022 2881 5002
            </p>

            <p style="text-align: center; font-size: 12px; margin: 0 0 0 0; line-height: 20px; font-weight: 300;">
                Email : meghnaagencies@gmail.com
            </p>

        </div>

        <div style="margin-top: 10px; margin-bottom: 10px;">
            <p style="text-align: center; font-size: 12px; margin: 0; line-height: 20px; font-weight: 300;">
                <b style="font-size: 14px; font-weight: 600;">TAX-INVOICE</b>
            </p>

            <div style="display: flex; justify-content: space-between; font-size: 14px; border: 1px solid #dddddd;">
                <div style="padding: 10px;">
                    <span>BILL NO.</span>
                    <b>: MEC/00038/24-25</b>
                </div>
                <div style="padding: 10px 10px 10px 50px; border-left: 1px solid #dddddd;">
                    <span>DATE</span>
                    <b>: 26-10-2024</b>
                </div>
            </div>
        </div>

        <div style="margin-top: 15px; margin-bottom: 10px; padding-left: 15px; font-size: 14px;">
            <p style="margin: 0 0 5px 0;"><b>M/S. MBS HATCHERIES.</b></p>
            <div style="margin-left: 30px; line-height: 20px; font-size: 12px;">
                <p style="margin: 0; width: 300px;">
                    4; ALAGAPPA LAYOUT, VENKATESA COLONY,
                    POLLACHI - 642 001.
                    (TAMIL NADU)
                    PAN: AAFFM1603A / GSTIN: 33AAFFM1603A1Z7
                </p>
                <div style="width: 400px; margin-top: 15px;">
                    <div style="display: flex;">
                        <p style="margin: 0; width: 200px;">
                            PARTY'S GSTIN
                        </p>
                        <p style="margin: 0;">: 33AAFFM1603A1Z7</p>
                    </div>
                    <div style="display: flex;">
                        <p style="margin: 0; width: 200px;">
                            PARTY'S STATE CODE
                        </p>
                        <p style="margin: 0;">: 33-TAMIL NADU</p>
                    </div>
                </div>
            </div>
        </div>


        <table style="width: 100%; border-collapse: collapse; font-size: 12px; border-bottom: 1px solid #ddd;"
            cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        SAUDA DATE</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        CONTRACT #</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        BUYER/SELLER NAME</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        COMMODITY</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        QTY
                    </th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        RATE/TON</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        PER TON</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        BROKERAGE AMOUNT (RS.)</th>
                </tr>
            </thead>
            <tbody style="border: 1px solid #ddd;">
                <tr>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd; border-left: 1px solid #ddd;">
                        31/05/2024</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">MEC/L/00040/24-25</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">SACHIN INTERNATIONAL PROTEINS PVT.
                        LTD.</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">SOYA EXT.</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">200.000</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">44100.00</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">25.00</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">5000.00</td>
                </tr>
                <tr>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd; border-left: 1px solid #ddd;">
                        31/05/2024</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">MEC/L/00040/24-25</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">SACHIN INTERNATIONAL PROTEINS PVT.
                        LTD.</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">SOYA EXT.</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">200.000</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">44100.00</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">25.00</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">5000.00</td>
                </tr>
                <tr>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd; border-left: 1px solid #ddd;">
                        31/05/2024</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">MEC/L/00040/24-25</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">SACHIN INTERNATIONAL PROTEINS PVT.
                        LTD.</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">SOYA EXT.</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">200.000</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">44100.00</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">25.00</td>
                    <td style="padding: 10px 10px; border-right: 1px solid #ddd;">5000.00</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="border-right: 1px solid #ddd; border-left: 1px solid #ddd;">
                        <span
                            style="text-decoration: underline; font-weight: 300; font-size: 13px; padding: 0 10px; display: inline-block; margin-top: 10px;">AMOUNT
                            IN
                            WORD(S)</span>
                        <p style="padding: 0 10px;">RUPEES TWENTY THOUSAND SIX HUNDRED FIFTY ONLY.</p>
                    </td>
                    <td colspan="4" style=" vertical-align: top; text-align: right;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; padding: 10px 10px;">
                                    Total</td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; padding: 10px 10px;">
                                    GST @18%</td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; padding: 10px 10px;">
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; padding: 10px 10px;">
                                    ROUNDOFF AMOUNT
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; padding: 10px 10px;">
                                    GRAND TOTAL
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td colspan="1" style=" border-right: 1px solid #ddd;   vertical-align: top;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px 10px; text-align: right;">
                                    <b>17500.00</b>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px 10px; text-align: right;">
                                    <b>3150.00</b>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px 10px; text-align: right;">
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px 10px; text-align: right;">
                                    <b>0.00</b>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px 10px; text-align: right;">
                                    <b>20650.00</b>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="border-right: 1px solid #ddd; border-left: 1px solid #ddd;">
                        <div
                            style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 100px;   line-height: 20px; padding: 10px 10px;">
                            <div style="display: flex;">
                                <span style="width: 100px;">PAN No</span>
                                <b>: AFRPC6408E</b>
                            </div>
                            <div style="display: flex;">
                                <span style="width: 100px;">GSTIN</span>
                                <b>: 27AFRPC6408E1ZI</b>
                            </div>
                        </div>
                    </td>
                    <td colspan="5"
                        style="border-right: 1px solid #ddd; border-left: 1px solid #ddd; text-align: right; vertical-align: top; padding: 10px 10px;">
                        <b style="font-size: 16px;">for MEGHNA ENTERPRISE</b>
                        <br />
                        <img src="http://localhost:3000/images/signature.jpg" alt="Signature" style="width: 106px; height: 30px; display: inline-block; margin: 20px 15px;" />
                        <br />
                        <span style="font-size: 14px;">(AS BROKER)</span>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>

</body>

</html>
`;


export default function Index() {

    const downloadBillingPdf = async () => {
        const billingData = {html: htmlContent};
        try {
            await convertHtmlToPdf(billingData);
            console.log("PDF generated and download triggered");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };
 
    const handleClick = () => {
        console.log('clicked');
        downloadBillingPdf();
    }

    return (    
        <>      
            {/* <img src="./images/signature.jpg" alt="Signature" style={{width: '106px', height: '30px'}} />     */}
            <img src="../public/images/signature.jpg" alt="Signature" style={{width: '106px', height: '30px'}} />    
            <button onClick={handleClick}>Convert HTML to PDF</button>         
        </>
    );
}


