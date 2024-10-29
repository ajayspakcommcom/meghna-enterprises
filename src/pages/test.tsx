import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function Index() {

    const pdfRef = useRef<HTMLDivElement>(null); 

  const generatePdf = async () => {
    const element = (pdfRef.current as HTMLDivElement);
    
    
    // Use html2canvas to take a screenshot of the HTML element
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    // Create a new jsPDF instance
    const pdf = new jsPDF();
    const imgWidth = 190; // PDF width in mm
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // If the image height is larger than a single page, add new pages
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save('generated.pdf');
  };
 
    return (    
        <>                      
            <div ref={pdfRef}>
                    <div
      style={{
        maxWidth: '1200px',
        margin: 'auto',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          color: '#333',
          backgroundColor: '#c0c0c0',
          margin: 'auto',
          padding: '10px 0',
        }}
      >
        MEGHNA ENTERPRISE
      </h2>

      <div style={{ width: '600px', margin: '10px auto' }}>
        <p
          style={{
            textAlign: 'center',
            fontSize: '12px',
            margin: '0 0 10px 0',
            lineHeight: '20px',
            fontWeight: '300',
          }}
        >
          504, SYNERGY, KACH PADA RD NO. 2, NEAR MALAD IND. ESTATE, RAMCHANDRA LANE EXTENTION, MALAD (W),
          MUMBAI - 400 064
        </p>
        <p style={{ textAlign: 'center', fontSize: '12px', margin: '0', lineHeight: '20px', fontWeight: '300' }}>
          Tel. : 022 2880 2452-Fax : 022 2881 5002
        </p>
        <p style={{ textAlign: 'center', fontSize: '12px', margin: '0', lineHeight: '20px', fontWeight: '300' }}>
          Email : meghnaagencies@gmail.com
        </p>
      </div>

      <div style={{ margin: '10px 0' }}>
        <p style={{ textAlign: 'center', fontSize: '12px', margin: '0', lineHeight: '20px', fontWeight: '300' }}>
          <b style={{ fontSize: '14px', fontWeight: '600' }}>TAX-INVOICE</b>
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', border: '1px solid #ddd' }}>
          <div style={{ padding: '10px' }}>
            <span>BILL NO.</span> <b>: MEC/00038/24-25</b>
          </div>
          <div style={{ padding: '10px 50px', borderLeft: '1px solid #ddd' }}>
            <span>DATE</span> <b>: 26-10-2024</b>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '15px', marginBottom: '10px', paddingLeft: '15px', fontSize: '14px' }}>
        <p style={{ margin: '0 0 5px 0' }}>
          <b>M/S. MBS HATCHERIES.</b>
        </p>
        <div style={{ marginLeft: '30px', lineHeight: '20px', fontSize: '12px' }}>
          <p style={{ margin: '0', width: '300px' }}>
            4; ALAGAPPA LAYOUT, VENKATESA COLONY, POLLACHI - 642 001. (TAMIL NADU)
            PAN: AAFFM1603A / GSTIN: 33AAFFM1603A1Z7
          </p>
          <div style={{ width: '400px', marginTop: '15px' }}>
            <div style={{ display: 'flex' }}>
              <p style={{ margin: '0', width: '200px' }}>PARTY'S GSTIN</p>
              <p style={{ margin: '0' }}>: 33AAFFM1603A1Z7</p>
            </div>
            <div style={{ display: 'flex' }}>
              <p style={{ margin: '0', width: '200px' }}>PARTY'S STATE CODE</p>
              <p style={{ margin: '0' }}>: 33-TAMIL NADU</p>
            </div>
          </div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', borderBottom: '1px solid #ddd' }}>
        <thead>
          <tr>
            {['SAUDA DATE', 'CONTRACT #', 'BUYER/SELLER NAME', 'COMMODITY', 'QTY', 'RATE/TON', 'PER TON', 'BROKERAGE AMOUNT (RS.)'].map((header) => (
              <th key={header} style={{ padding: '10px', border: '1px solid #ddd', backgroundColor: '#f7f7f7', textAlign: 'left' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>31/05/2024</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>MEC/L/00040/24-25</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>SACHIN INTERNATIONAL PROTEINS PVT. LTD.</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>SOYA EXT.</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>200.000</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>44100.00</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>25.00</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>5000.00</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div style={{ marginTop: '100px', textAlign: 'right' }}>
        <b style={{ fontSize: '16px' }}>for MEGHNA ENTERPRISE</b>
        <br />
        <img src="http://localhost:3000/images/signature.jpg" alt="Signature" style={{ width: '100px', height: '31px' }} />
        <br />
        <span style={{ fontSize: '14px' }}>(AS BROKER)</span>
      </div>
    </div>
                    
                    <button onClick={generatePdf} style={{ marginTop: '20px' }}>
                        Download PDF
                    </button>
                </div> 
        </>
    );
}


