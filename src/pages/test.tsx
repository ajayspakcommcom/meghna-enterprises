import React, { useEffect } from "react";
const converter = require('number-to-words');

import Header from "../../components/header";

export default function Index() {

    useEffect(() => {
        console.log(converter.toWords(45045));
    }, []);

    return (    
        <>
        <Header />
           <h1>Test</h1>
        </>
    );
}


