import React, { useState, useEffect } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import Navbar from './components/Navbar';
import './styles/calendar.css';
import { fetchDisplayEvents } from './calendar-events';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function Calendar() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [weekendsVisible, setWeekendsVisible] = React.useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  // Fetch savedPosts when the component mounts
  useEffect(() => {
    const loadEvents = async () => {
      const { myPosts, savedPosts  } = await fetchDisplayEvents();
      setMyPosts(myPosts);
      setSavedPosts(savedPosts);
      const calendarEvents = [
        ...myPosts.map((post) => ({ ...post, type: 'myPost' })), // Label each post type
        ...savedPosts.map((post) => ({ ...post, type: 'savedPost' })),
      ];
      setCalendarEvents(calendarEvents);
      console.log(savedPosts);
    };
    loadEvents();
  }, []);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  const handleEventClick = (info) => {
    navigate(`/event/${info.event.id}`);
  };

  return (
    <>
      <Navbar />
      <div className="calendar-app">
        <Sidebar
          weekendsVisible={weekendsVisible}
          handleWeekendsToggle={handleWeekendsToggle}
          myEvents={myPosts}
          savedEvents={savedPosts}
        />
        <div className="calendar-main">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            eventClick={handleEventClick}
            weekends={weekendsVisible}
            events={calendarEvents} // Load saved posts into the calendar
          />
        </div>
      </div>
    </>
  );

  function Sidebar({ weekendsVisible, myEvents, savedEvents }) {
    return (
      <div className="calendar-sidebar">
        <div className="calendar-sidebar-section">
          <Typography variant="h4" color="#BA0C2F" align="center" sx={{ marginTop: 4 }}>
            My Events ({calendarEvents.length})
          </Typography>
          <ul>
            {myEvents.map((event) => (
              <SidebarEvent key={event.id} event={event} />
            ))}
            {role !== 'event_attendee' && 
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3rem' }}>
                <BookmarkIcon sx={{ color: '#BA0C2F' }}/> 
                <Typography color="#BA0C2F">Saved Events</Typography>
              </div>
            }
             {savedEvents.map((event) => (
              <SidebarEvent key={event.id} event={event} />
            ))}
          </ul>
        </div>
        <div className="calendar-sidebar-section">
          <label>
            <FormControlLabel
              sx={{ display: 'block' }}
              control={
                <Switch
                  checked={weekendsVisible}
                  onChange={() => setWeekendsVisible(!weekendsVisible)}
                  name="Show Weekends"
                  color="primary"
                />
              }
              label="Show Weekends"
            />
          </label>
        </div>
      </div>
    );
  }

  function SidebarEvent({ event }) {
    return (
      <li key={event.id}>
        <b>
          {formatDate(event.start, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </b>
        <i>{event.title}</i>
      </li>
    );
  }
}
