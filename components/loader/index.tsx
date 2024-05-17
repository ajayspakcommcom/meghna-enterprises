import { CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";


interface CircularProgressLoaderProps {

}

const Index: React.FC<CircularProgressLoaderProps> = ({ }) => {

    return (
        <div className="circle-loader">
            <CircularProgress />
        </div>
    );
}

export default React.memo(Index);