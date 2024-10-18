import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoadingState } from '../context/LoadingContext';
//import HeaderAppBar from '../components/HeaderAppBar';
import { Container, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableRow, TableContainer, Paper } from '@mui/material';
import UserHeaderAppBar from '../components/UserHeaderAppBar';
import ImageComponent from '../components/ResultImage';
const Result = () => {
    const {loading, setLoading} = useLoadingState();
    const [latestImagePath, setLatestImagePath] = useState(null);
    const [latestVideoPath, setLatestVideoPath] = useState(null);
    const [resultData, setResultData] = useState([]);

    useEffect(() => {
        axios.get('/api/get/image')
            .then(response => {
                console.log(response.data);
                if (response && response.data) {
                    let basePath = response.data;
                    console.log(basePath)
    
                    const rectangleImagePath = basePath.replace(/^public\//, '') + '_rectangle.jpg';
                    console.log(rectangleImagePath);

                    setLatestImagePath(`/${rectangleImagePath}`); // 루트 경로에서 시작하는 이미지 경로 설정
                }
            })
            .catch(error => {
                console.error('이미지 경로를 가져오는 중 오류 발생', error);
            });
    }, []);
    
    useEffect(() => {
        console.log("Latest image path:", latestImagePath);
    }, [latestImagePath]);

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
    }, []);
    
    useEffect(() => {
        setLoading(true);
        axios.get('/api/result')
            .then(response => {
                setLoading(false);
                setResultData(response.data); 
                console.log(response.data)
            })
            .catch(error => {
                console.error('결과 데이터를 가져오는 중 오류 발생:', error);
            });
    }, []);
    

    return (
        <>
            <UserHeaderAppBar/>
            <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
                <Box display="flex" flexDirection="column" alignItems="center" >
                    <Box display="flex" flexDirection="row" justifyContent="center" mb={4} sx={{ gap: 3 }}>
                        <Card sx={{ width: 300, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <CardContent sx={{ width: '100%', height: '100%', padding: 0, marginTop: '25px' }}>
                            <ImageComponent resultData={resultData}></ImageComponent>
                            </CardContent>
                        </Card>
                        <Card sx={{ width: 300, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <CardContent sx={{ width: '100%', height: '100%', padding: 0, marginTop: '25px' }}>
                            {loading ? (
                                <Typography variant="h6">Loading...</Typography>
                            ) : latestImagePath ? (
                                <img
                                    src={`${latestImagePath}`}
                                    alt="Latest"
                                    style={{ width: '100%', height: '100%', objectFit: 'scale-down' }}
                                />
                            ) : (
                                <Typography>No image available</Typography>
                            )}
                            </CardContent>
                        </Card>
                    </Box>
                    <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">Video Name</TableCell>
                                    <TableCell align="center">Time</TableCell>
                                    <TableCell align="center">Accuracy</TableCell>
                                </TableRow>
                                {resultData.length > 0 ? (
                                    resultData.map((item, index) => {
                                        const key = Object.keys(item)[0]; // 객체의 첫 번째 키를 가져옴
                                        const result = item[key]; // 해당 키의 데이터를 가져옴
                                        
                                        return (
                                            <TableRow key={index}>
                                                <TableCell align="center">{result.video_name}</TableCell>
                                                <TableCell align="center">{result.time}</TableCell> 
                                                <TableCell align="center">{result.similarity.toFixed(2)}%</TableCell> {/* 유사도를 'accuracy'로 사용 */}
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell align="center" colSpan={2}>No Results Available</TableCell>
                                    </TableRow>
                                )} 
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        </>
    );
};

export default Result;
