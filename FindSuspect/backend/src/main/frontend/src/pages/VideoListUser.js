import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Card, CardContent, Grid, Container } from '@mui/material';
import UserHeaderAppBar from '../components/UserHeaderAppBar';

const VideoListUser = () => {
    const [videoPaths, setVideoPaths] = useState([]);

    useEffect(() => {
        axios.get('/api/get/video')
            .then(response => {
                const paths = response.data;
                setVideoPaths(paths);
            })
            .catch(error => {
                console.error('비디오 경로를 가져오는 중 오류 발생', error);
            });
    }, []);

    const getFullVideoPath = (videoName) => `/video/${videoName}/${videoName}`;

    return (
        <>
            <UserHeaderAppBar />
            <Container maxWidth="lg" style={{ marginTop: '50px' }}>
                <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                    비디오 목록
                </Typography>
                {videoPaths.length === 0 ? (
                    <Typography variant="body1">비디오가 없습니다.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {videoPaths.map((video, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card style={{ position: 'relative', height: '100%' }}>
                                    <video 
                                        style={{ width: '100%', borderRadius: '4px 4px 0 0' }} 
                                        controls 
                                    >
                                        <source src={getFullVideoPath(video)} type="video/mp4" />
                                        브라우저에서 비디오를 지원하지 않습니다.
                                    </video>
                                    <CardContent style={{ paddingBottom: '40px' }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {video}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </>
    );
};

export default VideoListUser;
