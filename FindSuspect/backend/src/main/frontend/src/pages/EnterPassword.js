import React, { useState } from "react";
import { Container, Typography, Button, TextField, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserHeaderAppBar from "../components/UserHeaderAppBar";

const EnterPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

   
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    
    const handleClick = () => {
        const correctPassword = "1234"; 
        if (password === correctPassword) {
            navigate('/AdminUpload');
        } else {
            setError(true);
        }
    };

    
    const handleCloseSnackbar = () => {
        setError(false);
    };

    return (
        <>
            <UserHeaderAppBar />
            <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
                <Typography className="landing-text" variant="h4" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                    Enter the Code
                </Typography>
                <TextField
                    type="password"
                    label="Password"
                    variant="outlined"
                    value={password}
                    onChange={handlePasswordChange}
                    style={{ marginBottom: '20px', width: '100%' }} // 스타일 수정
                />
                <Button
                    className="pulse"
                    variant="contained"
                    color="secondary"
                    sx={{ borderRadius: 5 }}
                    size="large"
                    onClick={handleClick}
                    style={{ marginTop: '30px', textTransform: 'none', fontWeight: 'bold' }}
                >
                    Check
                </Button>
            </Container>
            <Snackbar
                open={error}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Incorrect password"
                action={
                    <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
                        Close
                    </Button>
                }
            />
        </>
    );
};

export default EnterPassword;
