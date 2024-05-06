import Head from 'next/head';
import React from 'react';

const Index = () => {
    return (
        <>
            <Head>
                <title>Research Website | 404 Page Not Found</title>
                <meta name="description" content="Free Web tutorials" />
                <meta name="keywords" content="HTML, CSS, JavaScript" />
                <meta name="author" content="John Doe" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div>
                <p>Page Not found</p>
                <p>Sorry, something went wrong.</p>
            </div>
        </>
    );
};



export default Index;
