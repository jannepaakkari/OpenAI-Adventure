'use client';
import React from 'react';
import LocationSelector from '../containers/LocationSelector';
import Container from '@mui/material/Container';

const HomePage: React.FC = () => {
    return (
        <Container maxWidth="sm">
            <LocationSelector />
        </Container >
    );
};

export default HomePage;
