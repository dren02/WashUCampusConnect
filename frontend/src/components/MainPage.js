import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import '../styles/MainPage.css';

const MainPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch events from an API or use mock data
  useEffect(() => {
    // Replace this with API call
    const fetchEvents = async () => {
      try {
        // Example with mock data for now
        const mockEvents = [
          {
            id: 1,
            title: 'React Workshop',
            date: '2024-05-20',
            location: 'Online',
            description: 'blah blah description',
          },
          {
            id: 2,
            title: 'JavaScript Conference',
            date: '2024-06-15',
            location: 'New York, NY',
            description: 'blah blah description',
          },
          // Add more events as needed
        ];

        // Simulate API delay
        setTimeout(() => {
          setEvents(mockEvents);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch events.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="main-page-container">Loading events...</div>;
  }

  if (error) {
    return <div className="main-page-container error">{error}</div>;
  }

  return (
    <div className="main-page-container">
      <h1>Upcoming Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
