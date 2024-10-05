import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import washuLogo from '../assets/washuLogo.png';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ITEM_HEIGHT = 45;

const options = [
    'Edit',
    'Delete'
];

const ProfileCard = ({ event, onDelete }) => {
    const { id, name, date, time, address, details_of_event, username } = event;
    const currUser = localStorage.getItem('username')
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleDropdown = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDeleteOption = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this event? This action cannot be undone.");
        if (confirmDelete) {
            onDelete(id);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/auth/${currUser}/save-event/`, {
                eventId: id
            });
            alert(response.data.message);
        } catch (error) {
            console.error("Error saving event:", error);
            alert("An error occurred while saving the event.");
        }
    };

    const handleEdit = () => {
        navigate(`/edit-event/${id}`); // Navigate to edit event page
    };

    return (
        <Card sx={{ display: 'flex', maxWidth: 900, margin: 1 }}>
            <CardActionArea sx={{ display: 'flex', flexDirection: 'row' }}>
                <CardMedia
                    component="img"
                    sx={{ width: '100px', height: 'auto', marginLeft: '35px' }}
                    image={washuLogo}
                    alt="WashU Logo"
                />
                <CardContent sx={{ flex: 1, textAlign: 'left', marginLeft: '30px' }}>
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
                        {details_of_event}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Button size="small" color="primary" onClick={handleSave}  sx={{ marginBottom: 6, marginTop: 8 }}>
                    Save
                </Button>
                {currUser === username && (
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleDropdown}
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