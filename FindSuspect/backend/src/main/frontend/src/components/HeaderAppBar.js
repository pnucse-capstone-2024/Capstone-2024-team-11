import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import cctv from '../picture/cctv.png'
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const HeaderAppBar = () => {
  
  const navigate = useNavigate();
  const handleClickHome = () => {
    navigate('/');
};

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Box display="flex" alignItems="center" style={{ flexGrow: 1 }}>
          <img src={cctv} alt="cctv" style={{ marginRight: 15, width: 40, height: 40 }}/>
          <Box>
            <Typography variant="h6" align="left" style={{fontWeight:'bold'}}>
              Find Suspect
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          
          border={1}
          borderRadius={16}
          paddingX={2}
          paddingY={0.5}
          style={{ borderColor: 'black', marginRight: 10 }}
        >
          <Typography variant="body1">admin</Typography>
        </Box>
        <IconButton color="inherit">
          <SettingsIcon />
        </IconButton>
        <IconButton color="inherit" onClick={handleClickHome}>
          <HomeIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAppBar;
