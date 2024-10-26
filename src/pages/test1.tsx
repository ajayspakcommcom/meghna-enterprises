import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';


export default function Index() {

   


    return (
        <>
            <div style={{margin: 'auto', width: '1000px', padding: '30px', border: '1px solid #000', marginTop: '20px'}}>
                <div style={{backgroundColor: '#c0c0c0'}}>
                    <h1 style={{textAlign: 'center', margin:'auto', fontFamily:'Arial', fontWeight: 'bold', fontSize: '30px'}}>MEGHNA ENTERPRISE</h1>
                </div>
                <div style={{width: '800px', margin: 'auto'}}>
                    <p style={{textAlign: 'center', fontFamily:'Arial', fontSize: '14px', lineHeight: '25px'}}>504, SYNERGY, KACH PADA RD NO. 2, NEAR MALAD IND. ESTATE, RAMCHANDRA LANE EXTENTION, MALAD (W), MUMBAI - 400 064.</p>
                </div>
            </div>
        </>
    );
}


