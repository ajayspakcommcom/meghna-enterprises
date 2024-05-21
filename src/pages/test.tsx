import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, TextField, Container, Autocomplete } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../../components/header/index'));


export default function Index() {



    return (
        <>
            <Header />
        </>
    );
}


