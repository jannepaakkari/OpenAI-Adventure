'use client';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import countries from '../utils/countries';


const HomePage: React.FC = () => {
    const [suggestion, setSuggestion] = useState('');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const generateInputValue = () => {
        return `You are in ${selectedCity}, ${selectedCountry}. You are feeling adventurous. You want to go on an adventure. You decide to go to ${selectedCity}. You start your journey.`
    };

    const handleButtonClick = async () => {
        try {
            const response = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: generateInputValue() }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setSuggestion(data.choices[0].message.content);
        } catch (error) {
            console.error("Error:", error);
            setSuggestion('Failed to fetch suggestion.');
        }
    };

    const fetchCities = async (country: string) => {
        try {
            // Could also put cities in the utils (like countries) and import them, which could be better for performance.
            const response = await fetch(`https://countriesnow.space/api/v0.1/countries/cities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    country: country,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCities(data?.data);

        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleCountryChange = (event: any, value: string | null) => {
        setSelectedCountry(value);
        if (value) {
            fetchCities(value);
        } else {
            setCities([]);
        }
    };

    const handleCityChange = (event: any, value: string | null) => {
        setSelectedCity(value);
    }

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold">Welcome to Today’s Adventure App</h1>
            <div className="flex items-center mt-4">
                <Autocomplete
                    disablePortal
                    options={countries}
                    onChange={handleCountryChange}
                    sx={{
                        width: 300,
                        marginRight: '20px',
                        '& .MuiInputBase-root': {
                            backgroundColor: 'white',
                        },
                    }}
                    renderInput={(params) => <TextField {...params} label="Country" />}
                />
                <Autocomplete
                    disablePortal
                    options={cities}
                    onChange={handleCityChange}
                    sx={{
                        width: 300,
                        '& .MuiInputBase-root': {
                            backgroundColor: 'white',
                        },
                    }}
                    renderInput={(params) => <TextField {...params} label="Country" />}
                />
            </div>
            <div className="flex items-center mt-4">
                <Button
                    onClick={handleButtonClick}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    disabled={!selectedCity || !selectedCountry}
                >
                    Submit
                </Button>
            </div>
            <p className="mt-4">
                {suggestion.split('\n').map((line, index) => (
                    <span key={index}>
                        {line}
                        <br />
                    </span>
                ))}
            </p>
        </div>
    );

};

export default HomePage;
