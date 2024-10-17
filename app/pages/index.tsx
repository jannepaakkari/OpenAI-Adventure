'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Typography, Autocomplete, Button, Grid2 as Grid } from '@mui/material';
import ActivityCard from '../components/ActivityCard';
import countries from '../utils/countries';
import { getSeason } from '../utils/getSeason';
import useFetch from '../hooks/usePost';
import { OpenAIResponse } from '../interfaces/openAI';
import { CitiesResponse } from '../interfaces/cities';

const HomePage: React.FC = () => {
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const [{ data: citiesData, isLoading: isLoadingCities }, makeRequest] = useFetch<CitiesResponse>(
        'https://countriesnow.space/api/v0.1/countries/cities'
    );

    const [{ data: suggestion, isLoading: isLoadingResult, error: errorResult }, makeSuggestionRequest] = useFetch<OpenAIResponse>(
        '/api/openai'
    );

    useEffect(() => {
        if (citiesData) setCities(citiesData.data);
    }, [citiesData]);

    // "" etc. can be used (then we clear the city), but eslint doesn't like it
    // eslint-disable-next-line
    const handleCountryChange = (event: React.ChangeEvent<{}>, value: string | null) => {
        setSelectedCountry(value);
        if (value) {
            makeRequest({ country: value });
        } else {
            setSelectedCity(null);
            setCities([]);
        }
    };

    const generateInputValue = () => (
        `Please generate a list of diverse activities for morning, afternoon, evening and night ${selectedCity}, ${selectedCountry}.
        Include options that showcase the local culture, nature, and cuisine, and ensure the activities are suitable for a range of interests.
        Activities should be suitable for ${getSeason()}.`
    );

    const onSubmit = () => makeSuggestionRequest({ input: generateInputValue() });

    const renderResult = () => {
        if (isLoadingResult) return <Typography className='mb-1'>Loading...</Typography>;
        if (errorResult) return <Typography className='mb-1' color="error">{errorResult}</Typography>;
        return (
            <div>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {suggestion?.choices?.[0]?.message.content.split('###').map((line, index) => (
                        <ActivityCard key={index} cardKey={index} description={line} />

                    ))}
                </Grid>

            </div>
        );
    };

    return (
        <div className="p-5">
            <div className="flex flex-col md:flex-row items-center md:space-x-5 space-y-5 md:space-y-0">
                <Autocomplete
                    disablePortal
                    options={countries}
                    value={selectedCountry}
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
                    disabled={isLoadingCities}
                    value={isLoadingCities ? 'Loading...' : selectedCity}
                    onChange={(e, value) => setSelectedCity(value)}
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
                    className="py-2 px-4 rounded"
                    onClick={onSubmit}
                    disabled={!selectedCity || !selectedCountry || isLoadingResult || isLoadingCities}
                >
                    Plan My Adventure
                </Button>
            </div>
            <div className=' mt-4 mb-1'>{renderResult()}</div>
        </div>
    );
};

export default HomePage;
