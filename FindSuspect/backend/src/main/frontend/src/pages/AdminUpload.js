import React, { useState, useEffect } from 'react';
import HeaderAppBar from '../components/HeaderAppBar';
import { useLoadingState } from '../context/LoadingContext';
import { CircularProgress, Container, Typography, Button, Slider, Box } from '@mui/material';
import FileUpload from '../components/FileUpload';
import VideoUpload from '../components/VideoUpload';

const AdminUpload = () => {
    const { loading, setLoading } = useLoadingState(); 
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <>
            <HeaderAppBar />
            <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px'}}>
                <Box>
                    {loading ? <><Box 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center" 
            height="100vh"
        >
            <CircularProgress color="secondary" />
            <Typography variant="h6" style={{ marginTop: '20px' }}>
                비디오 업로드 중입니다...
            </Typography>
        </Box></> : <>
                            <Typography className="landing-text" variant="h4" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                                Suspicious Video
                            </Typography>
                            <VideoUpload/>
                        </>}
                </Box>
            </Container>
        </>
    );
};

export default AdminUpload;
