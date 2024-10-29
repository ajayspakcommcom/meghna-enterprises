
import { getBillingHtmlTemplate } from "@/services/common";
import React, { useEffect, useState } from "react";
import html2pdf from 'html2pdf.js';

export default function Index() {

    const pdfRef = React.useRef<HTMLDivElement>(null);

  const generatePdf = () => {
    const element = pdfRef.current;
    const options = {
      margin: 1,
      filename: 'generated.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(options).from(element).save();
  };
     
    return (    
        <>                      
            <div>
      <div ref={pdfRef} style={{ padding: '20px', background: '#fff' }}>
        <h1>Invoice</h1>
        <p>This is your billing information.</p>
        {/* Add more HTML content here as needed */}
      </div>
      
      <button onClick={generatePdf} style={{ marginTop: '20px' }}>
        Download PDF
      </button>
    </div>
        </>
    );
}


