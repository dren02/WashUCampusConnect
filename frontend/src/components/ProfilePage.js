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
import Navbar from '../components/Navbar'
import axios from 'axios';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function ProfilePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('myposts');
  const username = localStorage.getItem('username') || 'Guest';

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

  const filteredEvents = selectedTab === 'myposts'
  ? events.filter(event => event.username === username) // My posts
  : events.filter(event => event.saved); // Saved posts 

  const handleTabChange = (event, newTab) => {
    if (newTab !== null) {
      setSelectedTab(newTab);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
          <Navbar/>
      <Grid container spacing={2} justifyContent="center" style={{ height: '100%' }}>
        <Grid size={4}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              border: 'none',
              padding: '16px', 
            }}> 
            <Avatar sx={{ height: '200px', width: '200px', fontSize: '80px', backgroundColor: '#BA0C2F' }}>{username[0]} </Avatar> 
          </Box>
        </Grid>
        <Grid size={8}>
         <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              height: '100%',
              padding: '16px', 
            }}>
            {/* <ProfileMenu letter={username[0]} />  */}
            <Typography variant="h3">{username}</Typography>
            <Typography variant="body1" sx={{ marginTop: 3 }}>About section here</Typography>
          </Box>
        </Grid>
        <Grid size={12}>
          <Item>
            <ToggleButtonGroup
              color="primary"
              value={selectedTab}
              exclusive
              onChange={handleTabChange}
              aria-label="Platform">
              <ToggleButton value="myposts">My Posts</ToggleButton>
              <ToggleButton value="savedposts">Saved Posts</ToggleButton>
            </ToggleButtonGroup>
          </Item>
        </Grid>
        <Grid size={8}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            border: 'none',
          }}>
            <div>
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
          </div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfilePage;
