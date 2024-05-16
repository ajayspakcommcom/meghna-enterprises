import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container, Autocomplete } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../../components/header/index'));



export default function Index() {

    const router = useRouter();


    useEffect(() => {

        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/');
        }

    }, []);

    const goToPage = (url: string) => {
        router.push(`${url}`);
    };


    return (
        <>
            <Header />
            <h1>Test</h1>

        </>
    );
}


