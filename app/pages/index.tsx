'use client';
import React, { useState } from 'react';

const HomePage: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [suggestion, setSuggestion] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = async () => {
        try {
            const response = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: inputValue }),
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

    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to Today’s Adventure App</h1>
            <input 
                type="text"
                value={inputValue} 
                onChange={handleInputChange} 
                placeholder="Enter something..." 
                style={{ color: 'black', marginRight: '10px' }}
            />
            <button onClick={handleButtonClick}>Submit</button>
            <p>{suggestion.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ))}</p>
        </div>
    );
};

export default HomePage;
