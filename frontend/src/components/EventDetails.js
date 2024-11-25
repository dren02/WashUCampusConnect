import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, TextField, List, ListItem, ListItemText, Divider, CardMedia, IconButton, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import '../styles/EventDetails.css';
import washuLogo from '../assets/washuLogo.png';
import EditIcon from '@mui/icons-material/Edit';
import '../styles/EventDetails.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const currUser = localStorage.getItem('username');
  const [author, setAuthor] = useState('');
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingRSVP, setLoadingRSVP] = useState(false);
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false); // State for RSVP modal
  const [optIntoNotifications, setOptIntoNotifications] = useState(false); // State for notifications
  const [refreshFlag, setRefreshFlag] = useState(false); // refetch event after a comment is deleted
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/events/${id}`);
        setEvent(response.data);
        setAuthor(response.data.username);
        setRsvps(response.data.rsvps || []);
        setComments(response.data.comments || []);
        setHasRSVPed(response.data.rsvps?.includes(currUser));
      } catch (err) {
        setError('Failed to fetch event details.');
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, currUser, refreshFlag]);

  const handleBackClick = () => {
    navigate('/main');
  }

  const handleRSVP = async (isRSVPing, optIntoNotifications) => {
    setLoadingRSVP(true);
    try {
      const formData = new FormData();
      formData.append('username', currUser);
      formData.append('notifications', optIntoNotifications);

      if (hasRSVPed) {
        const response = await axios.post(`http://localhost:8000/events/${id}/rsvp`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSnackbarMessage(response.data.message || 'RSVP removed successfully!');
        setRsvps(prev => prev.filter(user => user !== currUser));
        setHasRSVPed(false);
      } else {
        const response = await axios.post(`http://localhost:8000/events/${id}/rsvp`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSnackbarMessage(response.data.message || 'RSVP successful!');
        setRsvps(prev => [...prev, currUser]);
        setHasRSVPed(true);
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("RSVP Error:", error);
      setSnackbarMessage('An error occurred while updating your RSVP.');
      setSnackbarOpen(true);
    } finally {
      setLoadingRSVP(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const formData = new FormData();
        formData.append('username', currUser);
        formData.append('comment', newComment);

        await axios.post(`http://localhost:8000/events/${id}/comment`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Update comments state
        setComments(prev => [...prev, `${currUser}: ${newComment}`]);
        setNewComment('');
      } catch (error) {
        console.error("Comment Error:", error);
        setSnackbarMessage('Failed to add comment.');
        setSnackbarOpen(true);
      }
    }
  };

  const handleRSVPClick = () => {
    if (!hasRSVPed) {
      setRsvpModalOpen(true);
    } else {
      handleRSVP(false, false); // Directly call handleRSVP for un-RSVP without notification prompt
    }
  };

  const handleRSVPConfirm = () => {
    // Call handleRSVP with the appropriate parameters
    handleRSVP(true, optIntoNotifications);
    setRsvpModalOpen(false); // Close the modal after confirming
  };

  const handleModalClose = () => {
    setRsvpModalOpen(false);
  };

  const handleEdit = () => navigate(`/edit-event/${id}`);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleDeleteComment = async (index) => {
    try {
      await axios.delete(`http://localhost:8000/events/${id}/comments/${index}`);
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event found.</p>;

  const displayedImage = event.image_url || washuLogo;

  const handleClickUsername = (username) => {
    navigate(`/profile/${username}`);
  }

  return (
    <Box sx={{ paddingX: 5, paddingY: 4, minHeight: '100vh', backgroundColor: '#f9f9f9', color: '#333' }}>
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
      <ArrowBackIcon onClick={handleBackClick} t={2} sx={{
        cursor: 'pointer',
        fontSize: '2rem',
        transition: 'transform 0.2s',
        marginLeft: '20px',
        '&:hover': {
          transform: 'scale(1.2)',
        },
      }} />
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
          {author !== currUser && (
            <Button
              variant="outlined"
              onClick={handleRSVPClick}
              disabled={loadingRSVP}
              sx={{ width: '150px', color: '#BA0C2F', borderColor: '#BA0C2F' }}
            >
              {loadingRSVP ? "Processing..." : (hasRSVPed ? "Remove RSVP" : "RSVP")}
            </Button>
          )}
{/* RSVP Modal */}
<Dialog open={rsvpModalOpen} onClose={handleModalClose}>
        <DialogTitle>RSVP to Event</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Would you like to RSVP to this event? You can also opt into notifications to stay updated.
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={optIntoNotifications}
                onChange={() => setOptIntoNotifications(!optIntoNotifications)}
              />
            }
            label="Opt into notifications"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} sx={{ color: '#555' }}>
            Cancel
          </Button>
          <Button onClick={handleRSVPConfirm} variant="contained" sx={{ backgroundColor: '#BA0C2F' }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

            {author === currUser && (
              <IconButton onClick={handleEdit} sx={{ color: '#BA0C2F' }}>
                <EditIcon />
                <Typography>&nbsp;Edit</Typography>
              </IconButton>
            )}
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1, color: '#333' }}>Comments</Typography>
          <Paper
            elevation={1}
            sx={{
              maxHeight: 200,
              overflow: 'auto',
              padding: 2,
              marginBottom: 2,
              backgroundColor: '#f9fafb',
            }}
          >
            {comments.length > 0 ? (
            comments.map((comment, index) => {
              // Extract the comments' author and its content
              const [commentAuthor, ...commentParts] = comment.split(':');
              const commentText = commentParts.join(':').trim(); 

              return (
                <Box key={index} sx={{ marginBottom: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#444',  cursor: 'pointer', '&:hover': {textDecoration: 'underline'}}} onClick={() => handleClickUsername(commentAuthor)}>
                      <strong>{commentAuthor}:</strong> {commentText}
                    </Typography>
                    {commentAuthor === currUser && (
                      <IconButton onClick={() => handleDeleteComment(index)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Divider sx={{ marginY: 1 }} />
                </Box>
              );
            })
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
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button variant="contained" onClick={handleCommentSubmit} sx={{ backgroundColor: 'rgb(186, 12, 47)' }}>Submit</Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper elevation={1} sx={{ padding: 3, backgroundColor: '#ffffff', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>RSVPs</Typography>
            <List>
              {rsvps.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default EventDetails;