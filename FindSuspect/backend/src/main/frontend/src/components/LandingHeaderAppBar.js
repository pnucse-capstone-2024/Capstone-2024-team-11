import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton} from '@mui/material';
import cctv from '../picture/cctv.png'
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const LandingHeaderAppBar = () => {
  const navigate = useNavigate();
  const handleClickHome = () => {
    navigate('/home');
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
        <IconButton color="inherit" onClick={handleClickHome}>
                <HomeIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default LandingHeaderAppBar;
