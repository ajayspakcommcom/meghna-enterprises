import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface SuccessConfirmationDialogProps {
    isOpen: boolean;
    heading: string;
}

const Index: React.FC<SuccessConfirmationDialogProps> = ({ isOpen, heading }) => {

    const [open, setOpen] = React.useState(false);

    useEffect(() => {

        setOpen(isOpen)

    }, [isOpen]);

    const handleClose = () => {
        console
        setOpen(false);
    };

    return (
        <React.Fragment>
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
        </React.Fragment>
    );
}

export default React.memo(Index);