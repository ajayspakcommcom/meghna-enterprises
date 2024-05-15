import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ContractPreviewProps {
    isOpen: boolean;
    heading: string;
    contentData?: any;
    onClick?: (val: boolean) => void,
}

const Index: React.FC<ContractPreviewProps> = ({ isOpen, heading, contentData, onClick }) => {

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);


    const handleClose = () => {
        console.log('Ram');
        if (onClick) {
            onClick(false);
        }
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

                {contentData &&
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <pre>
                                {JSON.stringify(contentData)}
                            </pre>
                        </DialogContentText>
                    </DialogContent>
                }

                <DialogActions>
                    <Button onClick={handleClose}>Ok</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default React.memo(Index);