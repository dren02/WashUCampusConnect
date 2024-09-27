import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ProfileMenu from '../components/ProfileMenu';
import ProfileCard from '../components/ProfileCard';
import axios from 'axios';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function ProfilePage({ username }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/events');
        setEvents(response.data);
        console.log(response.data)
      } catch (err) {
        setError('Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // const filteredEvents = events.filter(event => event.username === currentUsername);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} justifyContent="center" style={{ height: '100%' }}>
        <Grid size={4}>
          <Item
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}> <Avatar src="/broken-image.jpg" sx={{ height: '200px', width: '200px' }} /> </Item>
        </Grid>
        <Grid size={8}>
         <Item
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              height: '100%',
            }}>
            <ProfileMenu letter="M" /> 
            <Typography variant="h3">User</Typography>
            <Typography variant="body1" sx={{ marginTop: 3 }}>About section...</Typography>
          </Item>
        </Grid>
        <Grid size={12}>
          <Item>
            <ToggleButtonGroup
              color="primary"
              // value={alignment}
              exclusive
              // onChange={handleEdit}
              aria-label="Platform"
            >
              <ToggleButton value="myposts">My Posts</ToggleButton>
              <ToggleButton value="savedposts">Saved Posts</ToggleButton>
            </ToggleButtonGroup>
          </Item>
        </Grid>
        <Grid size={8}>
          <Item sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}>
            {/* show only user's post: */}
            {/* <div>
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <ProfileCard 
            key={event.id} 
            event={event} 
          />
        ))
      ) : (
        <div>No posts available</div>
      )}
    </div> */}
            {events.map((event) => (
              <ProfileCard key={event.id} event={event} />
            ))}
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfilePage;
