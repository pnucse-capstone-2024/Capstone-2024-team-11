import React, { useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLoading2 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 결과 데이터가 확인될 때까지 계속 폴링하는 함수
        const fetchData = async () => {
            const interval = setInterval(async () => {
                try {
                    const response = await axios.get('/api/result');
                    console.log('결과 데이터:', response.data);

                    // 데이터가 비어 있지 않으면 summary로 이동하고, 타이머 종료
                    if (response.status === 200 && response.data && Object.keys(response.data).length > 0) {
                        clearInterval(interval);  
                        navigate('/summary');     // summary 페이지로 이동
                    } else {
                        console.log('결과가 아직 준비되지 않음');
                    }
                } catch (error) {
                    console.error('API 요청 중 오류 발생:', error);
                    clearInterval(interval);  // 오류가 발생하면 타이머 중지
                    alert('API 요청 중 오류 발생');
                }
            }, 2000);  // 2초마다 API를 요청
        };

        fetchData();

        return () => clearInterval(fetchData); // 컴포넌트가 언마운트될 때 타이머 중지
    }, [navigate]);

    return (
        <Box 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center" 
            height="100vh"
        >
            <CircularProgress color="secondary" />
            <Typography variant="h6" style={{ marginTop: '20px' }}>
                결과를 불러오는 중입니다...
            </Typography>
        </Box>
    );
};

export default UserLoading2;
