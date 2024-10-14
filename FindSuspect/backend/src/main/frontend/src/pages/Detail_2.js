import React, {useEffect, useState} from 'react';
import { Typography, Container, Card, CardContent, Button, Box, Divider, Grid, Paper, Table, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import UserHeaderAppBar from '../components/UserHeaderAppBar';
import axios from 'axios';
import qs from 'qs';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';

Chart.register(ArcElement);

const Detail_2 = () => {
  const [videoPaths, setVideoPaths] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { data, imagePath, rectanglePath, key } = location.state || {}; 
  let rectangleImagepath = `${imagePath}_rectangle.jpg`;
  console.log(rectangleImagepath);
  console.log(key);
  console.log(data);
  let videoRectanglePath = key;
  let videoCropPath = `video/${data.video_name}/${key}`;
  if (videoRectanglePath && videoRectanglePath.endsWith('_cropped.jpg')){
    videoRectanglePath = videoRectanglePath.replace('_cropped.jpg', '_rectangle.jpg');
  } else if(videoRectanglePath.endsWith('.jpg')){
    videoRectanglePath = videoRectanglePath.replace('.jpg','_rectangle.jpg');
  }
  videoRectanglePath = `video/${data.video_name}/${videoRectanglePath}`;
  console.log(videoRectanglePath)

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

  useEffect(() => {
    axios.get('/api/get/video')
        .then(response => {
            const paths = response.data;
            if (paths.length > 0) {
                setVideoPaths(paths);
            } else {
                alert('비디오 경로를 가져오는데 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('비디오 경로를 가져오는 중 오류 발생', error);
        });
  }, []);

  const getFullVideoPath = (videoName) => `/video/${videoName}/${videoName}`;

  const handleShowHistory = () => {
    navigate('/History3');
  };

  const formatPercentage = (value) => {
    return (value * 100).toFixed(2);
  };

  const doughnutChartData = {
    labels: ['Similarity', 'Remaining'],
    datasets: [
      {
        data: [data.similarity, 100 - data.similarity],
        backgroundColor: ['#4CAF50', '#E0E0E0'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutChartOptions = {
    circumference: 180,
    rotation: -90,
    cutout: '80%',
    plugins: {
      tooltip: { enabled: false },
    },
  };

  return (
    <>
      <UserHeaderAppBar />
      <Container maxWidth="lg" style={{ marginTop: '50px', marginBottom: '0px' }}> {/* marginBottom을 0으로 설정 */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant='h5' component="div" align='center'>
              <strong>Result</strong>
            </Typography>
            <Divider sx={{ backgroundColor: 'lightgray', mt: 1 }} />
            
            {/* Grid 컨테이너를 사용하여 이미지, 테이블, 이미지 한 줄로 배치 */}
            <Grid container spacing={2} alignItems="center">
              
              {/* 첫 번째 이미지 */}
              <Grid item xs={12} md={1.5}>
  <Paper 
    variant="outlined" 
    sx={{ 
      p: 1, 
      display: 'flex', 
      flexDirection: 'column', // 이미지와 텍스트를 세로로 배치
      justifyContent: 'center', 
      alignItems: 'center' 
    }}
  >
    <img 
      src={imagePath || 'default-placeholder.png'} 
      alt="Detected" 
      style={{ width: '120%', height: '150px', objectFit: 'contain', marginBottom: '5px' }} 
    />
    <Typography 
      variant="caption" 
      align="center" 
      sx={{ color: 'black', marginTop: '10px' }}
    >
      입력 이미지
    </Typography>
  </Paper>
</Grid>

              
              {/* 테이블 */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" align='center' style={{ marginTop: '20px' }}><strong>Top matched:</strong></Typography>
                <TableContainer component={Paper} sx={{ maxWidth: 250, margin: 'auto', marginBottom: '20px'}}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>특징</TableCell>
                        <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>원본 Top5</TableCell>
                        <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>파일 Top5</TableCell>
                      </TableRow>
                      {data.original_top5 && data.original_top5.map((feature, index) => (
                        <TableRow key={index}>
                          <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>{data.attr_words[index]}</TableCell>
                          <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>{formatPercentage(feature)}</TableCell>
                          <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>{formatPercentage(data.file_top5[index])}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              {/* 두 번째 이미지 */}
              <Grid item xs={12} md={4}>
  <Box display="flex" justifyContent="space-between" alignItems="center">
    {/* 첫 번째 이미지 */}
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 1, 
        display: 'flex', 
        flexDirection: 'column', // 이미지를 세로로 배치
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: '5px', 
        flexGrow: 1 
      }}
    >
      <img 
        src={videoRectanglePath || 'default-placeholder.png'} 
        alt="Result" 
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
      />
      <Typography 
        variant="caption" 
        align="center" 
        sx={{ color: 'black', marginTop: '10px' }} 
      >
        발견된 이미지
      </Typography>
    </Paper>
    
    {/* 두 번째 이미지 */}
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 1, 
        display: 'flex', 
        flexDirection: 'column', // 이미지를 세로로 배치
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: '5px', 
        flexGrow: 1 
      }}
    >
      <img 
        src={videoCropPath || 'default-placeholder.png'} 
        alt="Result" 
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
      />
      <Typography 
        variant="caption" 
        align="center" 
        sx={{ color: 'black', marginTop: '10px' }} 
      >
        크롭된 이미지
      </Typography>
    </Paper>
  </Box>
</Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 2번째 줄 1:2 비율로 레이아웃 설정 */}
        <Grid container spacing={2} sx={{ mt: 0 }} alignItems="center">
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ height: '200px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: -4, position: 'relative' }}>
                  <Box sx={{ width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                    <Box sx={{ position: 'absolute', textAlign: 'center', top: '63%', transform: 'translateY(-50%)' }}>
                      <Typography variant="h5" color="green">{(data.similarity).toFixed(2)}%</Typography>
                      <Typography variant="h5" color="green">score</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ height: '200px', p: 0 }}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={6} sx={{ display: 'flex', alignItems: 'stretch' }}>
                    <video 
                      style={{ width: '100%', height: '100%' }} 
                      controls 
                    >
                      <source src={getFullVideoPath(data.video_name)} type="video/mp4" />
                      브라우저에서 비디오를 지원하지 않습니다.
                    </video>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      maxWidth: '100%' 
                    }}>
                      <strong>비디오: {data.video_name || 'N/A'}</strong>
                    </Typography>
                    <Typography><strong>발견 시간: {data.time || 'N/A'}</strong></Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0 }}> {/* marginBottom 0으로 설정 */}
        <Button variant="contained" sx={{ bgcolor: 'skyblue', color: 'white', m: 2 }} onClick={handleSave}>
          저장
        </Button>
        <Button variant="contained" sx={{ bgcolor: 'skyblue', color: 'white', m: 2 }} onClick={handleShowHistory}>
          히스토리 보기
        </Button>
      </Box>
    </>
  );
};

export default Detail_2;
