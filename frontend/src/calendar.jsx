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

export default function Calendar() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [weekendsVisible, setWeekendsVisible] = React.useState(true);

  // Fetch savedPosts when the component mounts
  useEffect(() => {
    const loadEvents = async () => {
      const { savedPosts } = await fetchDisplayEvents();
      setCalendarEvents(savedPosts);
      console.log("here")
      console.log(savedPosts)
    };
    loadEvents();
  }, []);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  const handleDateClick = (arg) => {
    // todo: navigate to event details page
    alert(arg.dateStr);
  };

  return (
    <>
      <Navbar />
      <div className="calendar-app">
        <Sidebar
          weekendsVisible={weekendsVisible}
          handleWeekendsToggle={handleWeekendsToggle}
          currentEvents={calendarEvents}
        />
        <div className="calendar-main">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            dateClick={handleDateClick}
            weekends={weekendsVisible}
            events={calendarEvents} // Load saved posts into the calendar
            eventColor="#BA0C2F"
          />
        </div>
      </div>
    </>
  );

  function Sidebar({ weekendsVisible, currentEvents }) {
    return (
      <div className="calendar-sidebar">
        <div className="calendar-sidebar-section">
          <Typography variant="h4" color="#BA0C2F" align="center" sx={{ marginTop: 4 }}>
            My Events ({currentEvents.length})
          </Typography>
          <ul>
            {currentEvents.map((event) => (
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
