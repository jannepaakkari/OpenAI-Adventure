'use client';
import React, { useState } from 'react';
import { TextField, Typography, Autocomplete, Button } from '@mui/material';
import ActivityCard from '../components/ActivityCard';
import countries from '../utils/countries';


const HomePage: React.FC = () => {
    const [suggestion, setSuggestion] = useState('');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateInputValue = () => {
        return `Please generate a list of five to seven diverse activities for a full day (from 8 AM to 6 PM) in ${selectedCity}, ${selectedCountry}. 
        Include options that showcase the local culture, nature, and cuisine, and ensure the activities are suitable for a range of interests.
        Please separate different activities with '###.`;
    };

    const handleButtonClick = async () => {
        try {
            setIsLoading(true);
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
            setIsLoading(false);
        } catch (error) {
            console.error("Error:", error);
            setSuggestion('Failed to fetch suggestion.');
            setIsLoading(false);
        }
    };

    const fetchCities = async (country: string) => {
        try {
            // TODO: Could also put cities in the utils (like countries) and import them, which could be better for performance & reliability (i.e. API is down).
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
            setSelectedCity(null);
            setCities([]);
        }
    };

    const handleCityChange = (event: any, value: string | null) => {
        setSelectedCity(value);
    }

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Welcome to Today’s Adventure App</h1>
            <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
                <Autocomplete
                    disablePortal
                    options={countries}
                    onChange={handleCountryChange}
                    sx={{
                        width: 300,
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
                    renderInput={(params) => <TextField {...params} label="City" />}
                />
                <Button
                    color="success"
                    variant="contained"
                    onClick={handleButtonClick}
                    className="py-2 px-4 rounded"
                    disabled={!selectedCity || !selectedCountry || isLoading}
                >
                    Plan My Adventure
                </Button>
            </div>
            <br />
            {isLoading ? (
                <Typography variant="body1" className="mt-4">Loading...</Typography>
            ) : (
                <div style={{ padding: '20px' }}>
                    {suggestion.split('###').map((line, index) => (
                        <ActivityCard key={index} description={line} />
                    ))}
                </div>
            )}
        </div>
    );

};

export default HomePage;
