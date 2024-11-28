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
        username: ''
    });
    const [image, setImage] = useState(null); // New state for image file

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/events/${id}`);
                setEventData({
                    name: response.data.name,
                    details_of_event: response.data.details_of_event,
                    date: response.data.date,
                    time: response.data.time,
                    address: response.data.address,
                    username: response.data.username,
                });
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        fetchEventData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(eventData).forEach(([key, value]) => formData.append(key, value));
        
        if (image) {
            formData.append("image", image);
        }

        try {
            await axios.put(`http://localhost:8000/events/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/main`); // Redirect after updating
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
            <form className="edit-event-form" onSubmit={handleSubmit} encType="multipart/form-data">
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
                    value={eventData.date.split('T')[0]} 
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
                    value={eventData.time}
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
                {/* File Upload Section */}
            <Box sx={{ marginTop: 2 }}>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    Upload Event Image:
                </Typography>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                />
            </Box>
                <Button variant="contained" type="submit">
                    Update Event
                </Button>
            </form>
        </Box>
    );
};

export default EditEvent;
