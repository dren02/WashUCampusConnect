import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import MakePost from '../components/makePost';
import '../styles/MainPage.css';
import axios from 'axios';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Navbar from '../components/Navbar';
import { Box, Grid, Typography, Button, Menu, MenuItem } from '@mui/material';
import SortAscendingIcon from '@mui/icons-material/ArrowUpward';
import SortDescendingIcon from '@mui/icons-material/ArrowDownward';
import washuBanner from '../assets/washubanner.png';

const MainPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const username = localStorage.getItem('username') || 'Guest';
  const role = localStorage.getItem('role');
  const [isAscending, setIsAscending] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null); // Sort For controlling the menu
  const [sortType, setSortType] = useState('date'); //sort
  const [originalEvents, setOriginalEvents] = useState([]);

  const [filter, setFilter] = useState({
    username: '',
    date: '',
    time: '',
    name: '' // New field for event name search
  });

  const navigate = useNavigate(); // Initialize navigate function for navigation

  // Authentication check
  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token
      }
    };
    checkAuthentication();
  }, [navigate]);




  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/events');
      setEvents(response.data);
      setFilteredEvents(response.data); // Set filteredEvents to the fetched events initially
      setOriginalEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Dynamically filter events based on the current filter state
    let filtered = events;

    if (filter.username) {
      filtered = filtered.filter(event =>
        event.username.toLowerCase().includes(filter.username.toLowerCase())
      );
    }

    if (filter.date) {
      filtered = filtered.filter(event => event.date === filter.date);
    }

    if (filter.time) {
      filtered = filtered.filter(event =>
        event.time.startsWith(filter.time)
      );
    }

    if (filter.name) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [filter, events]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const togglePostModal = () => {
    setIsPostModalVisible(!isPostModalVisible);
    setSelectedEvent(null);
  };

  const editEvent = (event) => {
    setSelectedEvent(event);
    setIsPostModalVisible(true);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const clearFilter = () => {
    setFilter({ username: '', date: '', time: '', name: '' });
    setFilteredEvents(events);
  };

  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleSort = (type) => {
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      if (type === 'date') {
        return isAscending
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (type === 'name') {
        return isAscending
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
    setFilteredEvents(sortedEvents);
    setIsAscending(!isAscending);
    setSortType(type);
    handleSortMenuClose(); // Close the menu after selecting
  };

  const clearSort = () => {
    setFilteredEvents(originalEvents); // Reset to original order
    setSortType(null); // Reset sort type
    handleSortMenuClose();
  };

  if (loading) return <Typography variant="h6">Loading events...</Typography>;
  if (error) return <Typography variant="h6">{error}</Typography>;

  return (
    <>
      <Navbar />
      <Box sx={{ flexGrow: 1, padding: 2, minHeight: '100vh', position: 'relative' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" color="#BA0C2F" align="center" sx={{ marginBottom: 2, marginTop: 8 }}>
              Upcoming Events
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 2,
                padding: 2,
                borderRadius: 2,
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 5,
                  backgroundColor: '#BA0C2F',
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: '#a52919',
                  },
                  display: 'flex',
                  alignItems: 'center',
                }}
                startIcon={<FilterAltIcon />}
                onClick={toggleFilter}
              >
                Filter Events
              </Button>

              {/* Sort Button */}
              <Button
                onClick={handleSortMenuOpen}
                variant="contained"
                sx={{
                  borderRadius: 5,
                  backgroundColor: '#BA0C2F',
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: '#a52919',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  color: '#fff', // Ensures the text color is white
                }}
                startIcon={<SortAscendingIcon />}
                endIcon={<SortDescendingIcon />}
              >
                Sort
              </Button>

              {/* Sorting Options Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleSortMenuClose}
                sx={{
                  '& .MuiPaper-root': {
                    backgroundColor: '#f9f9f9', // Optional: light background for the menu
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <MenuItem onClick={() => toggleSort('date')}>
                  Sort by Date {isAscending && sortType === 'date' ? '▲' : '▼'}
                </MenuItem>
                <MenuItem onClick={() => toggleSort('name')}>
                  Sort by Name {isAscending && sortType === 'name' ? '▲' : '▼'}
                </MenuItem>
                <MenuItem onClick={clearSort}>
                  Clear Sort
                </MenuItem>
              </Menu>


              <Button
                variant="contained"
                color="success"
                onClick={togglePostModal}
                sx={{
                  borderRadius: 5,
                  padding: '10px 20px',
                  backgroundColor: '#42b72a',
                  '&:hover': {
                    backgroundColor: '#36a420',
                  },
                }}
                disabled={role === 'event_attendee'} // Disable if role is 'event_attendee'
              >
                Create Post
              </Button>
            </Box>
          </Grid>

          {isFilterVisible && (
            <Grid item xs={12}>
              <Box className="filter-section" sx={{ display: 'flex', gap: 2 }}>
                <input
                  type="text"
                  placeholder="Search by event name"
                  name="name"
                  value={filter.name}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
                <input
                  type="text"
                  placeholder="Search by username"
                  name="username"
                  value={filter.username}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
                <input
                  type="date"
                  name="date"
                  value={filter.date}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
                <input
                  type="time"
                  name="time"
                  value={filter.time}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={clearFilter}
                  sx={{
                    borderRadius: 5,
                    padding: '5px 5px',
                    fontSize: '10px',
                    borderColor: '#42b72a',
                    color: '#42b72a',
                    '&:hover': {
                      backgroundColor: '#d3e6d3',
                      borderColor: '#36a420',
                    },
                  }}
                >
                  Clear Filter
                </Button>
              </Box>
            </Grid>
          )}

          <Grid item xs={12} sx={{ marginBottom: '20px' }}>
            <Grid container spacing={2} sx={{ paddingLeft: { xs: 0, md: 2, lg: 15 } }}>
              {filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={event.id}>
                  <EventCard
                    event={event}
                    onDelete={handleDeleteEvent}
                    showRSVP={true}
                    sx={{
                      maxWidth: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
                      margin: '0 auto'
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {isPostModalVisible && (
            <MakePost event={selectedEvent} closeModal={togglePostModal} />
          )}
        </Grid>
      </Box>

      <img
        src={washuBanner}
        alt="WashU Banner"
        className="banner-image"
        style={{
          padding: 0,
          margin: 0,
          width: '100%',
          height: '80px',
          objectFit: 'cover',
          boxShadow: '0 -5px 15px rgba(0, 0, 0, 0.3)',
        }}
      />
    </>
  );
};

export default MainPage;
