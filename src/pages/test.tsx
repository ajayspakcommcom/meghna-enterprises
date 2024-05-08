import React, { useState } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';

interface Film {
    label: string;
    year: number;
}

const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 }
];

const MyComponent = () => {
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

    const handleAutocompleteChange = (event: React.ChangeEvent<{}>, value: Film | null) => {
        setSelectedFilm(value);
    };


    const handleSubmit = () => {
        if (selectedFilm) {
            // Autocomplete is selected
            console.log('Selected Film:', selectedFilm);
        } else {
            // Autocomplete is not selected
            console.log('Please select a film.');
        }
    };

    return (
        <div>
            <Autocomplete
                id="combo-box-demo"
                options={top100Films}
                getOptionLabel={(option) => option.label}
                value={selectedFilm}
                onChange={handleAutocompleteChange}
                renderInput={(params) => <TextField {...params} label="Movie" />}
            />
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    );
};

export default MyComponent;
