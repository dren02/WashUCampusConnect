import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';
import ProfileMenu from '../components/ProfileMenu';
import { useNavigate } from 'react-router-dom';


function ResponsiveAppBar() {
  const username = localStorage.getItem('username') || 'Guest';
  const navigate = useNavigate();

  const handleFeaturedEventsClick = () => {
    navigate('/featured-events');
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: '#BA0C2F', borderBottom: '1px solid #D3D3D3' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Link to="/main" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
             WashU | CampusConnect
          </Typography>
          </Link>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Link to="/main" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            CampusConnect
          </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} /> {/* This Box pushes the content to the right */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/featured-events" style={{ textDecoration: 'none', color: '#BA0C2F', marginRight: '20px' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }} onClick={handleFeaturedEventsClick} >
                Featured Events
              </Typography>
            </Link>
            <ProfileMenu letter={username[0]} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
