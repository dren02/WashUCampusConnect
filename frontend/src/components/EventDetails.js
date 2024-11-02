import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, TextField, List, ListItem, ListItemText, Divider, CardMedia, IconButton
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import '../styles/EventDetails.css';
import washuLogo from '../assets/washuLogo.png';
import EditIcon from '@mui/icons-material/Edit';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currUser = localStorage.getItem('username');
  const [author, setAuthor] = useState('');
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [rsvpedUsers, setRsvpedUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/events/${id}`);
        setEvent(response.data);
        setAuthor(response.data.username);
        setRsvpedUsers(response.data.rsvpedUsers || []);
        setComments(response.data.comments || []);
        setHasRSVPed(response.data.rsvpedUsers?.includes(currUser));
      } catch (err) {
        setError('Failed to fetch event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, currUser]);

  const handleRSVP = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/events/${id}/rsvp`, { username: currUser });
      alert(response.data.message || 'RSVP successful!');
      setHasRSVPed(true);
      setRsvpedUsers(prev => [...prev, currUser]);
    } catch (error) {
      console.error('Error with RSVP:', error);
      alert('An error occurred while RSVPing for the event.');
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post(`http://localhost:8000/events/${id}/comment`, {
          username: currUser,
          comment: newComment,
        });
        setComments(prev => [...prev, response.data.comment]);
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment.');
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-event/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event found.</p>;

  const displayedImage = event.image_url || washuLogo; // Use event image or default

  return (
    <Box sx={{ paddingX: 5, paddingY: 4, minHeight: '100vh', backgroundColor: '#f9f9f9 ', color: '#333' }}>
      <CardMedia
        component="img"
        sx={{
          width: '100%',
          height: '250px',
          objectFit: 'cover',
          borderRadius: 2,
          marginBottom: 3
        }}
        image={displayedImage}
        alt="Event Image"
      />

      <Typography variant="h4" align="center" sx={{ marginBottom: 2, color: '#222', fontWeight: 'bold' }}>
        {event.name}
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 2 }}>
          <Paper elevation={1} sx={{ padding: 3, backgroundColor: '#ffffff', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Event Details</Typography>
            <Typography variant="body1" sx={{ marginTop: 1, color: '#555', lineHeight: 1.6 }}>
              {event.details_of_event}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
              <CalendarMonthIcon sx={{ marginRight: 1, color: '#555' }} />
              <Typography variant="body2">{event.date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
              <AccessTimeIcon sx={{ marginRight: 1, color: '#555' }} />
              <Typography variant="body2">{event.time}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
              <PlaceIcon sx={{ marginRight: 1, color: '#555' }} />
              <Typography variant="body2">{event.address}</Typography>
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', gap: 2, marginY: 3 }}>
            <Button
              variant="outlined"
              onClick={handleRSVP}
              disabled={hasRSVPed}
              sx={{ width: '150px', color: '#BA0C2F', borderColor: '#BA0C2F' }}
            >
              {hasRSVPed ? "RSVP'd" : "RSVP"}
            </Button>
            {author === currUser && (
              <IconButton onClick={handleEdit} sx={{ color: '#BA0C2F' }}>
                <EditIcon />
              </IconButton>
            )}

          </Box>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1, color: '#333' }}>Comments</Typography>
          <Paper elevation={1} sx={{ maxHeight: 200, overflow: 'auto', padding: 2, marginBottom: 2, backgroundColor: '#f9fafb' }}>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Box key={index} sx={{ marginBottom: 1 }}>
                  <Typography variant="body2" sx={{ color: '#444' }}>
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 1 }}>
            <TextField
              label="Add a comment"
              variant="outlined"
              size="small"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleCommentSubmit}
              sx={{
                backgroundColor: '#BA0C2F',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#A00A28', // Darker shade on hover
                },
              }}
            >
              Post
            </Button>

          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1, color: '#333' }}>RSVP'd Users</Typography>
          <Paper elevation={1} sx={{ padding: 2, maxHeight: '60vh', overflow: 'auto', backgroundColor: '#f9fafb' }}>
            <List>
              {rsvpedUsers.length > 0 ? (
                rsvpedUsers.map((user, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText primary={user} sx={{ color: '#333' }} />
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