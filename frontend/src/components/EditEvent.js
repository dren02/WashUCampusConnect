import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import '../styles/EditEvent.css'; 

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        name: '',
        details_of_event: '',
        date: '',
        time: '',
        address: '',
        username: '' // Keep the username in the state
    });

    // Fetch event data when component mounts
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/events/${id}`);
                console.log('Fetched event data:', response.data); // Debug log
                setEventData({
                    name: response.data.name,
                    details_of_event: response.data.details_of_event,
                    date: response.data.date,
                    time: response.data.time,
                    address: response.data.address,
                    username: response.data.username, // Keep the username
                });
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        fetchEventData();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/events/${id}`, {
                ...eventData,
                username: eventData.username // Ensure username is included in the update
            });
            navigate(`/main`); // Redirect after updating
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    // Handle input changes
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
                    label="Event Name"
                    name="name"
                    value={eventData.name}
                    onChange={handleChange}
                    required
                    margin="normal"
                    InputLabelProps={{ shrink: true }} 
                />
                <TextField
                    fullWidth
                    label="Details of Event"
                    name="details_of_event"
                    value={eventData.details_of_event}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    margin="normal"
                    InputLabelProps={{ shrink: true }} 
                />
                <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    name="date"
                    value={eventData.date.split('T')[0]} // Format date for input
                    onChange={handleChange}
                    required
                    margin="normal"
                    InputLabelProps={{ shrink: true }} 
                />
                <TextField
                    fullWidth
                    label="Time"
                    type="time"
                    name="time"
                    value={eventData.time} // Ensure this matches the format returned
                    onChange={handleChange}
                    required
                    margin="normal"
                    InputLabelProps={{ shrink: true }} 
                />
                <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={eventData.address}
                    onChange={handleChange}
                    required
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
