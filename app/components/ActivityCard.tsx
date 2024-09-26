import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface ActivityCardProps {
    description: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ description }) => {
    if (description.length === 0) {
        return null;
    }
    return (
        <div className='mb-1'>
            <Card variant="outlined">
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