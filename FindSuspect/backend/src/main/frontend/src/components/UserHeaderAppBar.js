import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import cctv from '../picture/cctv.png';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const UserHeaderAppBar = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    
    const handleAdminClick = () => {
        handleMenuClose();
        navigate('/password');
    };

    
    const handleClickHome = () => {
        navigate('/');
    };

    return (
        <AppBar position="static" color="primary" elevation={0}>
            <Toolbar>
                <Box display="flex" alignItems="center" style={{ flexGrow: 1 }}>
                    <img src={cctv} alt="cctv" style={{ marginRight: 15, width: 40, height: 40 }} />
                    <Box>
                        <Typography variant="h6" align="left" style={{ fontWeight: 'bold' }}>
                            Find Suspect
                        </Typography>
                    </Box>
                </Box>
                <IconButton color="inherit" onClick={handleMenuClick}>
                    <SettingsIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleAdminClick}>Admin</MenuItem>
                    {/* 추가 메뉴 항목이 필요하면 여기에 추가 */}
                </Menu>
                <IconButton color="inherit" onClick={handleClickHome}>
                    <HomeIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default UserHeaderAppBar;
