import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmationDialogProps {
    onAgree: (val: string) => void;
    onDisagree: (val: string) => void;
    isOpen: boolean;
    heading: string;
    content?: string;
}

const Index: React.FC<ConfirmationDialogProps> = ({ onAgree, onDisagree, isOpen, heading, content }) => {

    const [open, setOpen] = React.useState(false);

    useEffect(() => {

        setOpen(isOpen)

    }, [isOpen]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAgree = () => {
        onAgree('yes');
        setOpen(false);
    };

    const handleDisagree = () => {
        onDisagree('no');
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

                {content &&
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {content}
                        </DialogContentText>
                    </DialogContent>
                }

                <DialogActions>
                    <Button onClick={handleDisagree}>Disagree</Button>
                    <Button onClick={handleAgree} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default React.memo(Index);