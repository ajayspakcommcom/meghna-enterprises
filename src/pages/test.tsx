import { convertHtmlToPdf } from "@/services/billing";
import { getBillingHtmlTemplate } from "@/services/common";
import React, { useEffect, useState } from "react";

const htmlContent = `${getBillingHtmlTemplate()}`;


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


