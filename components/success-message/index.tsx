import * as React from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material';
import { AlertTitle } from '@mui/material';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <Alert severity="success">
        <AlertTitle>{message}</AlertTitle>
    </Alert>
);

export default React.memo(ErrorMessage);