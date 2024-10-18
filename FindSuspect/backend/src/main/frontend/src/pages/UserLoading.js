import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoadingState } from '../context/LoadingContext';
import { Container, Typography, CircularProgress, Box, Card, CardContent, CardMedia } from '@mui/material';
import UserHeaderAppBar from '../components/UserHeaderAppBar';

const UserLoading = () => {
    const navigate = useNavigate();
    const {loading, setLoading} = useLoadingState();
    const [latestImagePath, setLatestImagePath] = useState(null);

    const finishLoading = () => {
        setLoading(false);
        navigate('/history');
    }

    useEffect(() => {
        setLoading(true);
        axios.get('/api/get/image')
        .then(response => {
            console.log(response.data);
            if(response){
                const paths = response.data;
                console.log(paths);
                if(paths.length > 0){
                    setLatestImagePath(paths);
                    //finishLoading();
                } else {
                    alert('이미지 경로를 가져오는데 실패했습니다.');
                }
            }
        })
        .catch(error => {
            console.error('이미지 경로를 가져오는 중 오류 발생');
            alert('이미지 경로 오류');
            navigate('/UserUpload');
        })
    }, []);

    return (
        <>
            <UserHeaderAppBar />
            <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="60vh">
                    {loading ? (
                        <>
                            <CircularProgress />
                            <Typography variant="body1" style={{ marginTop: '20px' }}>
                                Loading...
                            </Typography>
                        </>
                    ) : (
                        latestImagePath ? (
                            <Card sx={{ width: 300, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                                <CardContent sx={{ width: '100%', height: '100%', padding: 0, marginTop: '25px' }}>
                                <img
                                src={`${latestImagePath}`}
                                alt="Latest"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                                </CardContent>
                            </Card>
                        ) : (
                            <Typography variant="body1">
                                업로드 된 이미지가 없습니다.
                            </Typography>
                        )
                    )}
                </Box>
            </Container>
        </>
    );
};

export default UserLoading;
