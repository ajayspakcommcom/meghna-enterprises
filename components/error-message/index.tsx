import * as React from 'react';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';

interface SuccessMessageProps {
    message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => (
    <Alert severity="error">
        <AlertTitle>{message}</AlertTitle>
    </Alert>
);

export default React.memo(SuccessMessage);