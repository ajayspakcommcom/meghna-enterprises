import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from "next/router";

interface SuccessConfirmationDialogProps {
    isOpen: boolean;
    heading: string;
    onClick?: (val: boolean) => void;
    redirect?: string
}

const Index: React.FC<SuccessConfirmationDialogProps> = ({ isOpen, heading, onClick, redirect }) => {

    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    useEffect(() => {

        setOpen(isOpen)

    }, [isOpen]);

    const handleClose = () => {
        if (onClick) {
            onClick(false);
        }
        setOpen(false);
        if (redirect) {
            router.push(`/${redirect}`);
        }
    };

    return (        
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{heading}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>        
    );
}

export default React.memo(Index);