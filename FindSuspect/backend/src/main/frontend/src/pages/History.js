import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoadingState } from '../context/LoadingContext';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import UserHeaderAppBar from '../components/UserHeaderAppBar';
import { useNavigate, useLocation } from 'react-router-dom';

const History = () => {
    const [latestImagePath, setLatestImagePath] = useState(null);
    const { loading, setLoading } = useLoadingState(null);
    const [resultData, setResultData] = useState([]);
    const [validCards, setValidCards] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { videoName } = location.state || {}; // Summery 페이지에서 넘어온 videoName

    useEffect(() => {
        axios.get('/api/get/image')
            .then(response => {
                if (response && response.data) {
                    let basePath = response.data;
                    setLatestImagePath(`${basePath}`);
                }
            })
            .catch(error => {
                console.error('이미지 경로를 가져오는 중 오류 발생', error);
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        axios.get('/api/result')
            .then(response => {
                setLoading(false);
                const filteredResults = videoName
                    ? Object.entries(response.data).filter(([key, details]) => {
                        const firstKey = Object.keys(details)[0];
                        const videoDetails = details[firstKey];
                        return videoDetails.video_name === videoName;
                    })
                    : Object.entries(response.data);
                setResultData(filteredResults);
            })
            .catch(error => {
                console.error('결과 데이터를 가져오는 중 오류 발생:', error);
            });
    }, [videoName]);

    useEffect(() => {
        const checkImageValidity = async () => {
            const validCardsPromises = resultData.map(async ([key, details]) => {
                const firstKey = Object.keys(details)[0];
                const videoDetails = details[firstKey];
                let rectangle = firstKey;
                if (rectangle.endsWith('_cropped.jpg')) {
                    rectangle = rectangle.replace('_cropped.jpg', '_rectangle.jpg');
                } else if (rectangle.endsWith('.jpg')) {
                    rectangle = rectangle.replace('.jpg', '_rectangle.jpg');
                }
                const rectangleImagePath = `video/${videoDetails.video_name}/${rectangle}`;
                try {
                    const response = await fetch(rectangleImagePath);
                    if (response.ok && latestImagePath) {
                        return { key, details, rectangleImagePath };
                    }
                } catch (error) {
                    console.error("이미지를 로드할 수 없음:", error);
                }
                return null;
            });

            const validCardsResults = await Promise.all(validCardsPromises);
            setValidCards(validCardsResults.filter(card => card !== null));
        };

        if (resultData.length > 0) {
            checkImageValidity();
        }
    }, [resultData, latestImagePath]);

    // video_name이 20자를 넘으면 줄이는 함수
    const truncateVideoName = (name, maxLength = 20) => {
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    return (
        <>
            <UserHeaderAppBar />
            <Container maxWidth="lg" sx={{ mt: 1 }}>
                {validCards.map(({ key, details, rectangleImagePath }, index) => {
                    const firstKey = Object.keys(details)[0];
                    const videoDetails = details[firstKey];

                    return (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <Card sx={{ display: 'flex', width: '66%', position: 'relative', height: '250px' }}> {/* 너비를 2/3로 설정 */}
                                <Box sx={{ flex: '0 0 40%', overflow: 'hidden' }}> {/* 왼쪽을 이미지가 가득 채우도록 설정 */}
                                    <img
                                        src={rectangleImagePath}
                                        alt="Latest"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} /* 이미지를 카드 안에 맞추고 잘리지 않도록 설정 */
                                    />
                                </Box>
                                <CardContent sx={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '20px' }}>
                                    <Typography variant="subtitle1"><strong>유사도: </strong> {videoDetails.similarity.toFixed(2)}%</Typography>
                                    <Typography variant="subtitle1">
                                        <strong>Video Source:</strong> {truncateVideoName(videoDetails.video_name)} {/* 긴 이름은 줄이기 */}
                                    </Typography>
                                    <Typography variant="subtitle1"><strong>Time:</strong> {videoDetails.time}</Typography>
                                    <Typography variant="subtitle1"><strong>Input Image:</strong></Typography>
                                    <img
                                        src={`${latestImagePath}`}
                                        alt="Rectangle"
                                        style={{ width: 80, height: 80, objectFit: 'contain', marginTop: '8px' }} /* Input Image도 동일하게 설정 */
                                    />
                                </CardContent>
                                <Button 
                                    variant="contained" 
                                    sx={{ 
                                        bgcolor: 'skyblue', 
                                        color: 'white', 
                                        position: 'absolute', 
                                        bottom: '10px', 
                                        right: '10px' 
                                    }} // 버튼을 오른쪽 하단에 위치
                                    onClick={() => navigate('/detail2', {
                                        state: {
                                            data: videoDetails,
                                            imagePath: latestImagePath,
                                            rectanglePath: rectangleImagePath,
                                            key: firstKey
                                        }
                                    })}
                                >
                                    View
                                </Button>
                            </Card>
                        </Box>
                    );
                })}
            </Container>
        </>
    );
};

export default History;
