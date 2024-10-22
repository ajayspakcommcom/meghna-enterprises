import React, { useEffect, useState } from "react";
const converter = require('number-to-words');

import Header from "../../components/header";




export default function Index() {

    const [name, setName] = useState([]);
    const [age, setAge] = useState([]);

    const handleChange = (e: any) => {
        setName(e.target.value);
    }

    const handleChangeAge = (e: any) => {
        setAge(e.target.value);
    }
    
    return (    
        <>
        <Header />
            <h1>Test</h1>            
        </>
    );
}


