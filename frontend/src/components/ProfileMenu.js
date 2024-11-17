import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ProfileMenu = ({ letter }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [newPassword, setNewPassword] = React.useState('');
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleViewProfile = () => {
        navigate('/profile');
    };

    const handleChangePassword = () => {
        setOpenDialog(true); 
        handleClose(); 
    };

    const handleCloseDialog = () => {
        setOpenDialog(false); 
        setNewPassword(''); // Clear the password field on close
    };

    
    const handleSavePassword = async () => {
        const username = localStorage.getItem('username'); // Retrieve the username from localStorage
            try {
            // Update user's about section in backend
            await axios.put(`http://localhost:8000/auth/${username}/change-password/`, newPassword, {
                headers: {
                'Content-Type': 'text/plain', // Set content type to text/plain
                },
            });
            console.log("New Password:", newPassword);
            alert('Password changed successfully!'); // Show success message
            handleCloseDialog(); 
            // Optionally redirect or perform additional actions
        } catch (error) {
            console.error('Error changing password:', error);
            if (error.response && error.response.data && error.response.data.detail) {
                alert(`Failed to change password: ${error.response.data.detail}`);
            } else {
                alert('Failed to change password: An unknown error occurred.');
            }
        }
    };
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmDelete) {
            try {
                const username = localStorage.getItem('username'); // Assuming you store the username in localStorage
                await axios.delete(`http://localhost:8000/auth/${username}`);
                console.log("Account deleted successfully");
                // Redirect to the homepage or perform any other action
                setTimeout(() => {
                    navigate('/login');
                  }, 1800);
            } catch (error) {
                console.error('Error deleting account:', error);
                if (error.response && error.response.data && error.response.data.detail) {
                    alert(`Failed to delete account: ${error.response.data.detail}`);
                } else {
                    alert('Failed to delete account: An unknown error occurred.');
                }
            }
        }
    };
    

    const logout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/'); 
    };

    return (
        <React.Fragment>
            <Box>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 40, height: 40, backgroundColor: '#BA0C2F' }}>{letter}</Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleViewProfile}>
                    <ListItemIcon>
                        <Avatar sx={{ backgroundColor: '#BA0C2F' }}>{letter}</Avatar>
                    </ListItemIcon>
                    View Profile
                </MenuItem>
                <MenuItem onClick={handleChangePassword}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Change Password
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    Delete Account
                </MenuItem>
                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* Change Password Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{sx: {width: '500px', maxWidth: '90%' }}}>
                
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSavePassword} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default ProfileMenu;
