import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import washuLogo from '../assets/images/washu_logo.png';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ProfileCard = ({ event }) => {
    const { id, name, date, time, address, details_of_event, username } = event;

    return (
        <Card sx={{ display: 'flex', maxWidth: 900, margin: 1 }}>
            <CardActionArea sx={{ display: 'flex', flexDirection: 'row' }}>
                <CardMedia
                    component="img"
                    sx={{ width: '150px', height: 'auto' }} // image will occupy 1/4 of the card
                    image={washuLogo}
                    alt="WashU Logo"
                />
                <CardContent sx={{ flex: 1, textAlign: 'left' }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        <CalendarMonthIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {date}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        <AccessTimeIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {time}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {details_of_event}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <PlaceIcon sx={{ marginRight: 1 }} fontSize="small" /> {address}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">
                    Save
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProfileCard;