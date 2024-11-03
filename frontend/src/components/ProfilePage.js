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
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
  const [selectedTab, setSelectedTab] = useState('savedposts');
  const loggedInUser = localStorage.getItem('username') || 'Guest';
  const role = localStorage.getItem('role');
  const [aboutMe, setAboutMe] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const navigate = useNavigate();
  const { username } = useParams(); // Get username from the URL params if it exists
  const userToFetch = username || loggedInUser;
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [searchUsername, setSearchUsername] = useState(''); 

  const fetchEvents = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'myposts') {
        const response = await axios.get('http://localhost:8000/events');
        setMyPosts(response.data);
      } else if (tab === 'savedposts') {
        const response = await axios.get('http://localhost:8000/auth');
        const userSavedPosts = response.data.find(user => user.username === userToFetch);
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
        const response = await axios.get(`http://localhost:8000/auth/${userToFetch}/about`);
        setAboutMe(response.data.about);
      } catch (err) {
        setAboutMe("About me unavailable");
      }
    };
    fetchAboutMe();
  }, [username]);


  const postsToDisplay = selectedTab === 'myposts'
    ? myPosts.filter(event => event.username === userToFetch) // My Posts
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

  const handleBackClick = () => {
    navigate('/main');
  }

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };


  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchUsername.trim()) {
      navigate(`/profile/${loggedInUser}`);  // Redirect to the logged-in user's profile if input is empty
    } else {
      navigate(`/profile/${searchUsername}`);  // Navigate to the searched user's profile
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
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

  {/* drop down search bar */}
  <Box sx={{ position: 'absolute', top: '100px', right: '20px' }}>
        <Box onClick={toggleDropdown} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Typography variant="body2" sx={{ color: '#6D6D6D', fontSize: '14px' }}>
            Search for other users
          </Typography>
          <ExpandMoreIcon sx={{ fontSize: '1rem', color: '#6D6D6D', marginLeft: '4px' }} />
        </Box>

        {/* drop down content */}
        <Collapse in={dropdownOpen} sx={{ marginTop: '8px' }}>
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              padding: '8px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              width: '200px',
            }}
          >
            <TextField
              label="Username"
              variant="outlined"
              size="small"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              sx={{
                width: '100%',
                backgroundColor: '#fff',
                borderRadius: '4px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#6D6D6D',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9e9e9e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6D6D6D',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              
              sx={{
                width: '100%',
                marginTop: '8px',
                textTransform: 'none',
                backgroundColor: '#4A4A4A', 
                color: '#FFFFFF',           
                '&:hover': {
                  backgroundColor: '#333333', 
                },
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(`/profile/${loggedInUser}`)}
              sx={{
                width: '100%',
                marginTop: '8px',
                textTransform: 'none',
                backgroundColor: '#4A4A4A', 
                color: '#FFFFFF',           
                '&:hover': {
                  backgroundColor: '#333333', 
                },
              }}
            >
              Return to Your Profile
            </Button>
          </Box>
        </Collapse>
      </Box>


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
            <Avatar sx={{ height: '200px', width: '200px', fontSize: '80px', backgroundColor: '#BA0C2F' }}>{userToFetch[0]} </Avatar>
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
            <Typography variant="h3">{username || loggedInUser}</Typography>
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
              <ToggleButton 
              value="myposts"
              disabled={role === 'event_attendee'}
               >My Posts</ToggleButton>
              <ToggleButton value="savedposts">&nbsp;&nbsp;Saved&nbsp;&nbsp;</ToggleButton>
            </ToggleButtonGroup>
          </Item>
        </Grid>
        <Grid size={8} >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',    
            height: '100%',
            border: 'none',
          }}>
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfilePage;
