import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import MakePost from '../components/makePost';
import '../styles/MainPage.css';
import axios from 'axios';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Navbar from '../components/Navbar';
import { Box, Grid, Typography, Button } from '@mui/material';
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
  const [isAscending, setIsAscending] = useState(true);

  const [filter, setFilter] = useState({
    username: '',
    date: '',
    time: ''
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/events');
      setEvents(response.data);
      setFilteredEvents(response.data); // Set filteredEvents to the fetched events initially
    } catch (err) {
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const applyFilter = () => {
    let filtered = events;

    // Filter by username
    if (filter.username) {
      filtered = filtered.filter(event => 
        event.username.toLowerCase().includes(filter.username.toLowerCase())
      );
    }

    // Filter by date
    if (filter.date) {
      filtered = filtered.filter(event => 
        event.date === filter.date
      );
    }

    // Filter by time
    if (filter.time) {
      filtered = filtered.filter(event => 
        event.time.startsWith(filter.time) // Assuming event.time is in HH:MM format
      );
    }

    setFilteredEvents(filtered);
  };

  const toggleSort = () => {
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      if (isAscending) {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });
    setFilteredEvents(sortedEvents);
    setIsAscending(!isAscending);
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
              }}>
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
                onClick={toggleFilter}>
                Filter Events
              </Button>

              {/* Sort Button */}
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
                onClick={toggleSort}>
                <SortAscendingIcon sx={{ marginRight: 0.5 }} />
                Sort
                <SortDescendingIcon sx={{ marginLeft: 0.5 }} />
              </Button>

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
                }}>
                Create Post
              </Button>
            </Box>
          </Grid>

          {isFilterVisible && (
            <Grid item xs={12}>
              <Box className="filter-section" sx={{ display: 'flex', gap: 2 }}>
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
                  variant="contained"
                  color="success"
                  onClick={applyFilter}
                  sx={{ borderRadius: 5, padding: '10px 20px' }}>
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          )}

          <Grid item xs={12} sx={{ marginBottom: '20px' }}>
            <Grid container spacing={2}>
              {filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <EventCard event={event} onDelete={handleDeleteEvent} />
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
