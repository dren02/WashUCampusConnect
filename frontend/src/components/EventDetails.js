import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, List, ListItem, ListItemText, Divider } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currUser = localStorage.getItem('username');
  const [author, setAuthor] = useState('');
  const [hasRSVPed, setHasRSVPed] = useState(false); // RSVP state

  // New state variables
  const [rsvpedUsers, setRsvpedUsers] = useState([]); // State to track RSVPed users
  const [comments, setComments] = useState([]); // State to store comments
  const [newComment, setNewComment] = useState(''); // State to manage new comment input

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/events/${id}`);
        setEvent(response.data);
        setAuthor(response.data.username);
        setRsvpedUsers(response.data.rsvpedUsers || []); // Fetch list of RSVPed users
        setComments(response.data.comments || []); // Fetch comments
        setHasRSVPed(response.data.rsvpedUsers?.includes(currUser)); // Set hasRSVPed
      } catch (err) {
        setError('Failed to fetch event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, currUser]);

  // Handle RSVP action
  const handleRSVP = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/events/${id}/rsvp`, {
        username: currUser,
      });
      alert(response.data.message || 'RSVP successful!');
      setHasRSVPed(true); // Mark as RSVPed
      setRsvpedUsers((prev) => [...prev, currUser]); // Update RSVP list with current user
    } catch (error) {
      console.error('Error with RSVP:', error);
      alert('An error occurred while RSVPing for the event.');
    }
  };

  // Handle new comment submission
  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post(`http://localhost:8000/events/${id}/comment`, {
          username: currUser,
          comment: newComment,
        });
        setComments((prev) => [...prev, response.data.comment]); // Update comments list
        setNewComment(''); // Clear input field
      } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event found.</p>;

  return (
    <Box sx={{ padding: 2, minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Typography variant="h4" color="#BA0C2F" align="center" sx={{ marginBottom: 3 }}>
        {event.name}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        
        {/* Left Column: Event Details, Comments */}
        <Box sx={{ flex: 2 }}>
          {/* Event Details */}
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Event Details</Typography>
            <Typography variant="body1" sx={{ marginTop: 1, color: '#555' }}>
              {event.details_of_event}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
              <CalendarMonthIcon sx={{ marginRight: 1, color: '#BA0C2F' }} />
              <Typography variant="body2">{event.date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
              <AccessTimeIcon sx={{ marginRight: 1, color: '#BA0C2F' }} />
              <Typography variant="body2">{event.time}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
              <PlaceIcon sx={{ marginRight: 1, color: '#BA0C2F' }} />
              <Typography variant="body2">{event.address}</Typography>
            </Box>
          </Paper>

          {/* RSVP Button */}
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
            <Button
              variant="contained"
              color={hasRSVPed ? "secondary" : "success"}
              onClick={handleRSVP}
              disabled={hasRSVPed}
              sx={{ width: '150px' }}
            >
              {hasRSVPed ? "RSVP'd" : "RSVP"}
            </Button>
            {author === currUser && (
              <Button variant="contained" color="primary" sx={{ width: '150px' }}>
                Edit Event
              </Button>
            )}
          </Box>

          {/* Comments Section */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>Comments</Typography>
          <Paper elevation={1} sx={{ maxHeight: 200, overflow: 'auto', padding: 2, marginBottom: 2 }}>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Box key={index} sx={{ marginBottom: 1 }}>
                  <Typography variant="body2" sx={{ color: '#333' }}>
                    <strong>{comment.username}:</strong> {comment.comment}
                  </Typography>
                  <Divider sx={{ marginY: 1 }} />
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Paper>

          {/* Comment Input */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 1 }}>
            <TextField
              label="Add a comment"
              variant="outlined"
              size="small"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
              Post
            </Button>
          </Box>
        </Box>

        {/* Right Column: RSVP'd Users */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>RSVP'd Users</Typography>
          <Paper elevation={1} sx={{ padding: 2, maxHeight: '60vh', overflow: 'auto' }}>
            <List>
              {rsvpedUsers.length > 0 ? (
                rsvpedUsers.map((user, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText primary={user} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No users have RSVPed yet.
                </Typography>
              )}
            </List>
          </Paper>
        </Box>

      </Box>
    </Box>
  );
};

export default EventDetails;
