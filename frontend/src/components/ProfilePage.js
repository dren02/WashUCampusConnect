import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ProfileCard from '../components/ProfileCard';
import Navbar from '../components/Navbar'
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import EditAbout from './EditAbout';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function ProfilePage() {
  const [myPosts, setMyPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('myposts');
  const username = localStorage.getItem('username') || 'Guest';
  const [aboutMe, setAboutMe] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const fetchEvents = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'myposts') {
        const response = await axios.get('http://localhost:8000/events');
        setMyPosts(response.data);
      } else if (tab === 'savedposts') {
        const response = await axios.get('http://localhost:8000/auth');
        const userSavedPosts = response.data.find(user => user.username === username);
        if (userSavedPosts) {
          setSavedEventIds(userSavedPosts.savedEvents);
        } else {
          setSavedEventIds([]);
        }
      }
    } catch (err) {
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };
  // trigger fetchEvents(tab) on tab change
  useEffect(() => {
    fetchEvents(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/auth/${username}/about`);
        setAboutMe(response.data.about);
      } catch (err) {
        setAboutMe("About me unavailable");
      }
    };
    fetchAboutMe();
  }, [username]);
  

  const postsToDisplay = selectedTab === 'myposts'
    ? myPosts.filter(event => event.username === username) // My Posts
    : savedPosts; // Saved Posts

  const handleTabChange = (event, newTab) => {
    if (newTab !== null) {
      setSelectedTab(newTab);
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (savedEventIds.length > 0) {
        try {
          const ids = savedEventIds.join(',');
          const response = await axios.get(`http://localhost:8000/events/?ids=${ids}`);
          setSavedPosts(response.data);
        } catch (err) {
          console.error('Failed to fetch saved events:', err);
        }
      }
    };
    fetchEventDetails();
  }, [savedEventIds]);

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/events/${id}`);
      fetchEvents(selectedTab);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  const handleEditAbout = () => {
    setIsEditModalVisible(!isEditModalVisible);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
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
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
              <Typography variant="body1" sx={{ marginTop: 3 }}>{aboutMe}</Typography> {/* Display the aboutMe state */}
              <MenuItem onClick={handleEditAbout}>
                <EditIcon fontSize="small" />
              </MenuItem>
            </Box>

            {isEditModalVisible && (
              <EditAbout
                closeModal={handleEditAbout}
                about={aboutMe}
              />
            )}
          </Box>
        </Grid>
        <Grid size={12}>
          <Item>
            {loading && <p>Loading events...</p>}
            {error && <p>{error}</p>}
            <ToggleButtonGroup
              color="primary"
              value={selectedTab}
              exclusive
              onChange={handleTabChange}
              aria-label="Platform">
              <ToggleButton value="myposts" >My Posts</ToggleButton>
              <ToggleButton value="savedposts">&nbsp;&nbsp;Saved&nbsp;&nbsp;</ToggleButton>
            </ToggleButtonGroup>
          </Item>
        </Grid>
        <Grid size={8} >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            border: 'none',
          }}>
            <div>
              {postsToDisplay.length > 0 ? (
                postsToDisplay.map((event) => (
                  <ProfileCard
                    key={event.id}
                    event={event}
                    onDelete={handleDeleteEvent}
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
