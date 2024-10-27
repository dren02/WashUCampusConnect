import React from 'react';
import EventsWidget from './EventsWidget';
import Navbar from '../components/Navbar'
import Box from '@mui/material/Box';

const FeaturedEvents = () => {

  return (
    <>
      <Navbar/>
      <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',    
            border: 'none',
            marginTop: 1,
          }}>
        <EventsWidget/>
      </Box>
    </>
  );
};

export default FeaturedEvents;
