import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import '../styles/EditEvent.css'; 

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
    });

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/events/${id}`);
                setEventData(response.data);
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        fetchEventData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/api/events/${id}`, eventData);
            navigate(`/event/${id}`);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <Box className="edit-event-container">
            <Typography className="edit-event-title">Edit Event</Typography>
            <form className="edit-event-form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Event Title"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    required
                    margin="normal"
                    InputLabelProps={{ shrink: true }} 
                />
                <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    name="date"
                    value={eventData.date.split('T')[0]} 
                    onChange={handleChange}
                    required
                    margin="normal"
                    InputLabelProps={{ shrink: true }} 
                />
                <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    required
                    margin="normal"
                    InputLabelProps={{ shrink: true }} 
                />
                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}  
                />
                <Button variant="contained" type="submit">
                    Update Event
                </Button>
            </form>
        </Box>
    );
};

export default EditEvent;
