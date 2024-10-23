import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import morningImage from '../images/morning.png';
import eveningImage from '../images/evening.png';
import afternoonImage from '../images/afternoon.png';
import nightImage from '../images/night.png';


interface ActivityCardProps {
    cardKey: number;
    description: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ cardKey, description }) => {
    if (description.length === 0) {
        return null;
    }

    const cardClassName = cardKey % 2 === 0 ? 'bg-gray-300' : '';

    const getImageAndAltText = () => {
        switch (cardKey) {
            case 0:
                return { src: morningImage.src, alt: 'Morning' };
            case 1:
                return { src: eveningImage.src, alt: 'Evening' };
            case 2:
                return { src: afternoonImage.src, alt: 'Afternoon' };
            default:
                return { src: nightImage.src, alt: 'Night' };
        }
    };

    const { src, alt } = getImageAndAltText();

    return (
        <div className='mb-1'>

            <Card className={cardClassName} variant="outlined">
                <CardMedia
                    component="img"
                    image={src}
                    alt={alt}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary">
                        {description}
                    </Typography>
                </CardContent>
            </Card>

        </div>
    );
};

export default ActivityCard;