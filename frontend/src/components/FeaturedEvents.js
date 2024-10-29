import React from 'react';
import Navbar from '../components/Navbar'
import Box from '@mui/material/Box';
import EventType from './EventType';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FeaturedEvents = () => {
  const [eventType, setEventType] = React.useState('default');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setEventType(event.target.value);
  };

  const handleBackClick = () => {
    navigate('/main');
  }

  return (
    <>
      <Navbar />
      <ArrowBackIcon onClick={handleBackClick} t={2} sx={{
        cursor: 'pointer',
        fontSize: '2rem',
        transition: 'transform 0.2s',
        marginTop: '15px',
        marginLeft: '20px',
        '&:hover': {
          transform: 'scale(1.2)',
        },
      }} />
        <Typography variant="h4" color="#BA0C2F" align="center" sx={{ marginTop: 4 }}>
              Upcoming Events
            </Typography>
      <Box display="flex" justifyContent="flex-end" sx={{ paddingRight: 3 }}>
        <FormControl sx={{
          minWidth: 200,
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'rgb(66, 183, 42)'
            },
          },
        }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={eventType}
            label="Event Type"
            onChange={handleChange}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="concerts">Concerts & Performances</MenuItem>
            <MenuItem value="meetings">Meetings & Conferences</MenuItem>
            <MenuItem value="exhibits">Exhibits </MenuItem>
            <MenuItem value="lectures">Lectures & Presentations</MenuItem>
            <MenuItem value="research">Research</MenuItem>
            <MenuItem value="seminar">Seminar/Colloquia</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: 'none',
        marginTop: 1,
      }}>
        <EventType category={eventType} />
      </Box>
    </>
  );
};

export default FeaturedEvents;

