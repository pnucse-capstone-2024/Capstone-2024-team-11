import { Container, Typography, Button, Card, CardContent, Box, CardMedia } from '@mui/material';
import {Link} from 'react-router-dom';
import LandingHeaderAppBar from '../components/LandingHeaderAppBar';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Landing = () => {
    const [latestVideoPath, setLatestVideoPath] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/get/video')
        .then(response => {
            console.log(response.data);
            if(response){
                const paths = response.data;
                console.log(paths);
                if(paths.length > 0){
                    setLatestVideoPath(paths);
                } else {
                    alert('비디오 경로를 가져오는데 실패했습니다.');
                }
            }
        })
        .catch(error => {
            console.error('비디오 경로를 가져오는 중 오류 발생');
        })
        .finally(() => {
            setLoading(false);
        })
    }, []);
    
    
return (
        <>
        <LandingHeaderAppBar/>
        <Container maxWidth="md" style={{textAlign: 'center', marginTop: '50px'}}>  
            <Typography className="landing-text" variant="h4" style={{marginBottom: '20px', fontWeight: 'bold'}}>
                Suspicious video
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mb={3}>
                <Card sx={{ width: 300, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                    <CardContent sx={{ width: '100%', height: '100%', padding: 0, marginTop: '25px' }}>
                    {latestVideoPath ? (
                            <video
                                controls
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            >
                                <source src={`${latestVideoPath}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <Typography>No video available</Typography>
                        )}
                    </CardContent>
                </Card>
                <Button className="pulse" variant="contained" color="secondary" sx={{ borderRadius: 5 }} size="large"
                    component={Link} to="/userUpload" style={{ marginTop: '10px', textTransform: 'none', fontWeight: 'bold' }}>
                    start
                </Button>
            </Box>
        </Container>
        </>
    );
};

export default Landing;
