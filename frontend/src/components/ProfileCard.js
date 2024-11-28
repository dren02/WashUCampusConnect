import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import washuLogo from '../assets/washuLogo.png';

const ITEM_HEIGHT = 45;

const options = ['Edit', 'Delete'];

const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
};

const ProfileCard = ({ event, onDelete, onUnsave, selectedTab }) => {
    const { id, name, date, time, address, details_of_event, username, image_url } = event;
    const currUser = localStorage.getItem('username');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const displayedImage = image_url || washuLogo;
    const [isSaved, setIsSaved] = useState(true);

    const handleDropdown = (event) => setAnchorEl(event.currentTarget);

    const handleDeleteOption = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this event? This action cannot be undone.");
        if (confirmDelete) {
            onDelete(id);
        }
    };

    const handleClose = () => setAnchorEl(null);

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/auth/${currUser}/save-event/`, {
                eventId: id
            });
            alert(response.data.message);
            setIsSaved(true)
        } catch (error) {
            console.error("Error saving event:", error);
            alert("An error occurred while saving the event.");
        }
    };

    const handleUnsave = async () => {
        try {
            await axios.delete(`http://localhost:8000/auth/${currUser}/unsave-event/`, {
                data: { eventId: id }
            });
            setIsSaved(false);
            onUnsave(selectedTab);
        } catch (error) {
            console.error("Error unsaving event:", error);
            alert("An error occurred while unsaving the event.");
        }
    };

    const handleEdit = () => navigate(`/edit-event/${id}`);

    const handleCardClick = () => navigate(`/event/${id}`);

    return (
        <Card sx={{ display: 'flex', width: 900, height: 200, margin: 1 }}>
            <CardActionArea sx={{ display: 'flex', flexDirection: 'row' }} onClick={handleCardClick}>
                <CardMedia
                    component="img"
                    image={displayedImage}
                    alt="Event Image"
                    sx={{
                        width: 240, 
                        height: '100%',
                        objectFit: 'cover',  
                        flexShrink: 0,
                    }}
                />
                <CardContent sx={{ flex: 1, textAlign: 'left', paddingLeft: 3 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {username}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
                        <CalendarMonthIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {date}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
                        <AccessTimeIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {time}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 1.5 }}>
                        <PlaceIcon sx={{ marginRight: 1 }} fontSize="small" /> {address}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {truncateText(details_of_event, 15)}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: 2 }}>
                {currUser !== username && (
                <Button size="small" color="primary" onClick={(e) => { e.stopPropagation(); isSaved ? handleUnsave() : handleSave(); }} sx={{ marginBottom: 6, marginTop: 8 }}>
                    {isSaved ? 'Unsave' : 'Save'}
                </Button>
                 )} 
                {currUser === username && (
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={(e) => { e.stopPropagation(); handleDropdown(e); }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                )}
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                        paper: {
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '15ch',
                            },
                        },
                    }}
                >
                    {options.map((option) => (
                        <MenuItem key={option} onClick={() => {
                            handleClose();
                            if (option === 'Delete') handleDeleteOption();
                            if (option === 'Edit') handleEdit();
                        }}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </CardActions>
        </Card>
    );
};

export default ProfileCard;