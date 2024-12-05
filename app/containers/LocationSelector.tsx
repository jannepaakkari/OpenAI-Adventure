'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Typography, Autocomplete, Button, Grid2 as Grid } from '@mui/material';
import ActivityCard from '../components/ActivityCard';
import countries from '../utils/countries';
import { getSeason } from '../utils/getSeason';
import usePost from '../hooks/usePost';
import { OpenAIResponse } from '../interfaces/openAI';
import { CitiesResponse } from '../interfaces/cities';

const LocationSelector: React.FC = () => {
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const [{ data: citiesData, isLoading: isLoadingCities }, makeRequest] = usePost<CitiesResponse>(
        'https://countriesnow.space/api/v0.1/countries/cities'
    );

    const [{ data: suggestion, isLoading: isLoadingResult, error: errorResult }, makeSuggestionRequest] = usePost<OpenAIResponse>(
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
            setSelectedCity(null);
            makeRequest({ country: value });
        } else {
            setSelectedCity(null);
            setCities([]);
        }
    };

    const generateInputValue = () => (
        `Please generate a list of diverse activities for morning, afternoon, evening and night ${selectedCity}, ${selectedCountry}. Total 4 activities.
        Include options that showcase the local culture, nature, and cuisine, and ensure the activities are suitable for a range of interests.
        Activities should be suitable for ${getSeason()}.`
    );

    const onSubmit = () => makeSuggestionRequest({ input: generateInputValue() });

    const renderResult = () => {
        if (isLoadingResult) return <Typography className='mb-1'>Loading...</Typography>;
        if (errorResult) return <Typography className='mb-1' color="error">{errorResult}</Typography>;
        return (
            <div>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 2 }}>
                    {suggestion?.choices?.[0]?.message.content.split('###').map((line, index) => (
                        <Grid key={index} size={{ xs: 12, md: 6 }}>
                            <ActivityCard key={index} cardKey={index} description={line} />
                        </Grid>

                    ))}
                </Grid>

            </div>
        );
    };

    return (
        <>
            <div>
                <Autocomplete
                    disablePortal
                    selectOnFocus
                    autoComplete={false}
                    options={countries}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    sx={{
                        '& .MuiInputBase-root': {
                            backgroundColor: 'white',
                        },
                    }}
                    renderInput={(params) => <TextField {...params} label="Country" />}
                />
                <br />
                <Autocomplete
                    disablePortal
                    freeSolo
                    selectOnFocus
                    handleHomeEndKeys
                    autoComplete={false}
                    options={cities}
                    disabled={isLoadingCities}
                    value={selectedCity}
                    onChange={(e, value) => setSelectedCity(value)}
                    sx={{
                        '& .MuiInputBase-root': {
                            backgroundColor: 'white',
                        },
                    }}
                    renderInput={(params) => <TextField {...params} label="Location (i.e. city)" />}
                />
                <br />
                <Button
                    color="success"
                    variant="contained"
                    className="py-2 px-4 rounded"
                    onClick={onSubmit}
                    disabled={!selectedCountry || isLoadingResult || isLoadingCities}
                >
                    Plan My Adventure
                </Button>
            </div>
            <div className=' mt-4 mb-1'>{renderResult()}</div>
        </>
    );
};

export default LocationSelector;
