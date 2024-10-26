import React, { useEffect, useState } from "react";

const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Billing Invoice</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

        <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google Logo" style="width: 272px; height: 92px; display: block; margin: 0 auto;"/>

        <h2 style="text-align: center; color: #333;">Billing Invoice</h2>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
                <h3 style="margin: 0; color: #333;">Company Name</h3>
                <p style="margin: 5px 0;">1234 Street Name</p>
                <p style="margin: 5px 0;">City, State, Zip</p>
                <p style="margin: 5px 0;">Phone: (123) 456-7890</p>
            </div>
            <div>
                <h3 style="margin: 0; color: #333;">Invoice #12345</h3>
                <p style="margin: 5px 0;">Date: 2024-10-26</p>
                <p style="margin: 5px 0;">Due Date: 2024-11-05</p>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="margin: 0; color: #333;">Bill To:</h3>
            <p style="margin: 5px 0;">Client Name</p>
            <p style="margin: 5px 0;">5678 Client Street</p>
            <p style="margin: 5px 0;">City, State, Zip</p>
            <p style="margin: 5px 0;">Phone: (987) 654-3210</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">Description</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: right;">Quantity</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: right;">Unit Price</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Service 1</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">2</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$50.00</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$100.00</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Service 2</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">1</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$150.00</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$150.00</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #ddd;"><strong>Subtotal</strong></td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$250.00</td>
                </tr>
                <tr>
                    <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #ddd;"><strong>Tax (10%)</strong></td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$25.00</td>
                </tr>
                <tr>
                    <td colspan="3" style="padding: 10px; text-align: right; border: 1px solid #ddd;"><strong>Total</strong></td>
                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;"><strong>$275.00</strong></td>
                </tr>
            </tfoot>
        </table>

        <p style="text-align: center; color: #555; font-size: 12px; margin-top: 20px;">Thank you for your business!</p>
    </div>

</body>
</html>

`;


export default function Index() {

    const downloadPdf = async (htmlContent:any) => {
        const response = await fetch('/api/html-to-pdf', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ html: htmlContent, type: 'HTML-TO-PDF' }),
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated.pdf';
        a.click();
        };
 
    const handleClick = () => {
        console.log('clicked');
        downloadPdf(htmlContent);
    }

    return (    
        <>        
            <button onClick={handleClick}>Convert HTML to PDF</button>         
        </>
    );
}


