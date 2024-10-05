import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import MakePost from '../components/makePost';
import '../styles/MainPage.css';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Navbar from '../components/Navbar'


const MainPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
   // Collapsible sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false); // State for post modal
  const [selectedEvent, setSelectedEvent] = useState(null); // Store the selected event for editing
  const username = localStorage.getItem('username') || 'Guest';

  const [filter, setFilter] = useState({
    username: '',
    date: '',
    time: ''
  });

 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleFilter =() => {
    setIsFilterVisible(!isFilterVisible);
  }

  const togglePostModal = () => {
    setIsPostModalVisible(!isPostModalVisible);
    setSelectedEvent(null); // Reset selected event if adding new post
  };

  const editEvent = (event) => {
    setSelectedEvent(event); // Set the selected event for editing
    setIsPostModalVisible(true); // Open the modal
  };

  const applyFilter = () => {
    // Add the logic to apply the filter and fetch filtered events
    console.log('Filters applied:', filter);
  };

  if (loading) return <Typography variant="h6">Loading events...</Typography>;
  if (error) return <Typography variant="h6">{error}</Typography>;

  return (
    <>
      <Navbar/>
      <div className="main-layout">
        {/* Sidebar with collapsible feature */}
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
          <Link to="/profile" className="avatar-link">
            <div 
              className="avatar-container" 
              style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }} // Inline style logic here
            >
              <Avatar sx={{ backgroundColor: '#BA0C2F' }}>{username[0]} </Avatar> 
              {!isCollapsed && (
                <Typography variant="body1" className="profile-text">
                  Profile
                </Typography>
              )}
            </div>
          </Link>
          <button onClick={toggleSidebar} className="toggle-button">
            {isCollapsed ? '→' : '←'}
          </button>
          {!isCollapsed && (
            <>
              <Link to="/settings" className="sidebar-link">Settings</Link>
              <Link to="/help" className="sidebar-link">Help</Link>
            </>
          )}
        </aside>

        <div className="content">
  <h1>Upcoming Events</h1>

  {/* Container for both the filter and the create post button */}
  <div className="filter-and-create-container">
    <div className="filter-bar" onClick={toggleFilter}>
      <FilterAltIcon className="filter-icon" />
      <span className="filter-text">Filter Events</span>
    </div>

    {/* Button to open the create post modal */}
    <button className="create-post-button" onClick={togglePostModal}>
      Create Post
    </button>
  </div>

  {/* Filter Section - Show/Hide based on isFilterVisible */}
  {isFilterVisible && (
    <div className="filter-section">
      <div className="top-bar">
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
        <button className="enter-button" onClick={applyFilter}>
          Enter
        </button>
      </div>
    </div>
  )}

  <div className="events-list">
    {events.map((event) => (
      <EventCard key={event.id} event={event} />
    ))}
  </div>

  {/* Add the modal to create/edit posts */}
  {isPostModalVisible && (
    <MakePost
      event={selectedEvent} // Pass the selected event if editing
      closeModal={togglePostModal} // Pass function to close the modal
    />
  )}
</div>
</div>
  </>
);
};
export default MainPage;
