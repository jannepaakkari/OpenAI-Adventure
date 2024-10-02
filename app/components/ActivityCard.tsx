import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface ActivityCardProps {
    cardKey: number;
    description: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ cardKey, description }) => {
    if (description.length === 0) {
        return null;
    }

    const cardClassName = cardKey % 2 === 0 ? 'bg-gray-300' : '';

    return (
        <div className='mb-1'>
            <Card className={cardClassName} variant="outlined">
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