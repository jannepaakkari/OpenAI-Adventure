'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Typography, Autocomplete, Button } from '@mui/material';
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

    const handleCountryChange = (event: any, value: string | null) => {
        setSelectedCountry(value);
        if (value) {
            makeRequest({ country: value });
        } else {
            setSelectedCity(null);
            setCities([]);
        }
    };

    const generateInputValue = () => (
        `###Please generate a list of diverse activities for a full day (from 8 AM to 6 PM) in ${selectedCity}, ${selectedCountry}.
        ###Include options that showcase the local culture, nature, and cuisine, and ensure the activities are suitable for a range of interests.
        ###Activities should be suitable for ${getSeason()}. Each activity should not be longer than 1 hour. 
        ###Don't forget to include the time for lunch and travel between activities.
        ###Please separate different activities with ###.`
    );

    const onSubmit = () => makeSuggestionRequest({ input: generateInputValue() });

    const renderResult = () => {
        if (isLoadingResult) return <Typography className='mb-1'>Loading...</Typography>;
        if (errorResult) return <Typography className='mb-1' color="error">{errorResult}</Typography>;
        return suggestion?.choices?.[0]?.message.content.split('###').map((line, index) => (
            <ActivityCard key={index} cardKey={index} description={line} />
        ));
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Welcome to Today’s Adventure</h1>
            <p className='mb-2'>Today's Adventure helps users plan a full day of activities in a selected city and country.</p>
            <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
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
            <div className='mb-1'>{renderResult()}</div>
        </div>
    );
};

export default HomePage;
