import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Button, Typography, Grid, Box } from '@mui/material';
import UserHeaderAppBar from '../components/UserHeaderAppBar';
import { useNavigate } from 'react-router-dom';

const Summery = () => {
    const [summaryData, setSummaryData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/result')
            .then(response => {
                const result = response.data;
                console.log(result);
                const groupedByVideo = {};

                Object.entries(result).forEach(([key, value]) => {
                    const firstKey = Object.keys(value)[0];
                    const videoName = value[firstKey].video_name;

                    if (!groupedByVideo[videoName]) {
                        groupedByVideo[videoName] = [];
                    }
                    groupedByVideo[videoName].push({ key, details: value[firstKey] });
                });

                setSummaryData(groupedByVideo);
            })
            .catch(error => {
                console.error('Error fetching summary data:', error);
            });
    }, []);

    // 영상 이름을 20자로 제한하는 함수
    const truncateVideoName = (name, maxLength = 20) => {
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    const handleViewHistory = (videoName) => {
        navigate('/history', { state: { videoName } });
    };

    return (
        <>
            <UserHeaderAppBar />
            <Container maxWidth="lg" style={{ marginTop: '50px' }}>
                <Grid container spacing={3}>
                    {Object.entries(summaryData).map(([videoName, videoResults], index) => (
                        <Grid item xs={12} sm={6} key={index}> {/* 한 줄에 2개가 배치되도록 xs=12, sm=6 설정 */}
                            <Card sx={{ mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <CardContent>
                                    <Typography variant="h6">{truncateVideoName(videoName)}</Typography>
                                    <Typography variant="subtitle1">결과 수: {videoResults.length}</Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                                    <Button 
                                        variant="contained" 
                                        sx={{ bgcolor: 'skyblue', color: 'white' }} 
                                        onClick={() => handleViewHistory(videoName)}
                                    >
                                        결과 보기
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};

export default Summery;
