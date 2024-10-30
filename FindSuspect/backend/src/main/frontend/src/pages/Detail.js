import React from 'react';
import { Typography, Container, Card, CardContent, Grid, Paper, Table, TableBody, TableRow, TableCell, TableContainer, Button, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import UserHeaderAppBar from '../components/UserHeaderAppBar';
import axios from 'axios';
import qs from 'qs';

const Detail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, imagePath, rectanglePath, key } = location.state || {}; 

  const handleSave = async () => {
    try {
      const saveData = {
        image_name: key,
      };
      const urlEncodedData = qs.stringify(saveData);
      
      await axios.post('/api/history', urlEncodedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      alert('히스토리가 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('히스토리 저장 오류:', error);
      alert('히스토리 저장에 실패했습니다.');
    }
  };

  const handleShowHistory = () => {
    navigate('/History2');
  };

  return (
    <>
      <UserHeaderAppBar />
      <Container maxWidth="sm" style={{ marginTop: '50px', marginBottom: '20px' }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              <strong>결과</strong>
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom><strong>입력된 이미지:</strong></Typography>
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={imagePath || 'default-placeholder.png'} alt="Detected" style={{ width: '100%', maxWidth: '300px', height: 'auto' }} />
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom><strong>탐지된 이미지:</strong></Typography>
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={rectanglePath || 'default-placeholder.png'} alt="Result" style={{ width: '100%', maxWidth: '300px', height: 'auto' }} />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1"><strong>비디오 소스:</strong> {data.video_name || 'N/A'}</Typography>
                <Typography variant="subtitle1"><strong>시간:</strong> {data.time || 'N/A'}</Typography>
                <Typography variant="subtitle1"><strong>전체 유사도:</strong> {data.similarity || '0'}%</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ marginTop: '20px' }}><strong>특징:</strong></Typography>
                <TableContainer component={Paper} sx={{ maxWidth: 400, margin: 'auto', marginBottom: '20px', marginTop: '20px' }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell align="center">특징</TableCell>
                        <TableCell align="center">원본 Top5</TableCell>
                        <TableCell align="center">파일 Top5</TableCell>
                      </TableRow>
                      {data.original_top5 && data.original_top5.map((feature, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{data.attr_words[index]}</TableCell>
                          <TableCell align="center">{feature}</TableCell>
                          <TableCell align="center">{data.file_top5[index]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button variant="contained" sx={{ bgcolor: 'skyblue', color: 'white', m: 2 }} onClick={handleSave}>
              저장
            </Button>
            <Button variant="contained" sx={{ bgcolor: 'skyblue', color: 'white', m: 2 }} onClick={handleShowHistory}>
              히스토리 보기
            </Button>
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default Detail;
