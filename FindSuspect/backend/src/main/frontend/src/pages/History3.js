import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Card, CardContent, Grid, Paper, Divider, Button, Table, TableBody, TableRow, TableCell, IconButton } from '@mui/material';
import UserHeaderAppBar from '../components/UserHeaderAppBar';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import DeleteIcon from '@mui/icons-material/Delete';

Chart.register(ArcElement);

const History3 = () => {
  const [historyData, setHistoryData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    axios.get(`/api/history?page=${currentPage}`)
      .then(response => {
        console.log(response.data);
        setHistoryData(response.data.histories);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => {
        console.error('Error fetching history data:', error);
      });
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatPercentage = (value) => {
    return (value * 100).toFixed(2);
  };

  const deleteHistory = (id) => {
    axios.delete(`/api/history/${id}`)
        .then(() => {
            console.log(id);
            alert(`history이(가) 성공적으로 삭제되었습니다.`);
            // 삭제된 항목을 상태에서 제거
            setHistoryData(prevHistoryData => prevHistoryData.filter(item => item.id !== id));
        })
        .catch(error => {
            console.error('히스토리 삭제 중 오류 발생', error);
            alert('히스토리 삭제에 실패했습니다.');
        });
  };

  return (
    <>
      <UserHeaderAppBar />
      <Container maxWidth="lg" style={{ marginTop: '30px', marginBottom: '30px' }}>
        <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 'bold', color: 'black' }}>
          History
        </Typography>

        {historyData.length > 0 ? (
          historyData.map((item, index) => {
            let rectangle = item.videoImage; 
            if (rectangle && rectangle.endsWith('_cropped.jpg')) {
            rectangle = rectangle.replace('_cropped.jpg', '_rectangle.jpg');
            } else if (rectangle && rectangle.endsWith('.jpg')) {
            rectangle = rectangle.replace('.jpg', '_rectangle.jpg');
            }
            
            const rectangleImagePath = `video/${item.videoName}/${rectangle}`; 
            console.log(item.videoCrop);
            console.log(item.videoRect);
            const doughnutChartData = {
              labels: ['Similarity', 'Remaining'],
              datasets: [
                {
                  data: [item.similarity, 100 - item.similarity],
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
              <Card key={index} style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: 'black', textAlign: 'left', marginBottom: '10px' }}>
                    Record {index + 1}
                  </Typography>
                  <Divider style={{ marginBottom: '20px' }} />

                  <Grid container spacing={2}>
                    {/* Left side: Two images */}
                    <Grid item xs={12} md={2}>
                      <Box display="flex" justifyContent="space-around" alignItems="center">
                        <Paper variant="outlined" style={{ padding: '10px', textAlign: 'center', backgroundColor: '#ecf0f1', marginRight: '5px' }}>
                          <img src={item.imageName} alt="Original" style={{ width: '100%', maxWidth: '200px', height: 'auto'}} />
                          <Typography variant="caption" align="center" style={{ color: 'black' }}>입력된 이미지</Typography>
                        </Paper>
                      </Box>
                    </Grid>

                    {/* Middle: Table */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: 'black', marginBottom: '10px', textAlign: 'center' }}>
                        <strong>Top matched</strong>
                      </Typography>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>Attribute</TableCell>
                            <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>Original Top 5</TableCell>
                            <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>File Top 5</TableCell>
                          </TableRow>
                          {item.attr_words.map((word, i) => (
                            <TableRow key={i}>
                              <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>{word}</TableCell>
                              <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>{formatPercentage(item.original_top5[i])}</TableCell>
                              <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>{formatPercentage(item.file_top5[i])}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Grid>

                    {/* Right side: One Image */}
                    <Grid item xs={12} md={4}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      {/* 왼쪽 Rectangle 이미지 (퍼센티지로 확대) */}
                      <Paper 
                        variant="outlined" 
                        style={{ 
                          padding: '10px', 
                          textAlign: 'center', 
                          backgroundColor: '#ecf0f1', 
                          marginRight: '5px',
                          flexGrow: 2 // 이미지 비율에 맞춰 확장
                        }}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <img 
                            src={item.videoRect} 
                            alt="Rectangle" 
                            style={{ width: '70%', height: 'auto' }} // 70% 크기로 확대
                          />
                          <Typography variant="caption" align="center" style={{ color: 'black', marginTop: '10px' }}>발견된 이미지</Typography>
                        </Box>
                      </Paper>

                      {/* 오른쪽 Detected Object 이미지 (퍼센티지로 축소) */}
                      <Paper 
                        variant="outlined" 
                          style={{ 
                          padding: '10px', 
                          textAlign: 'center', 
                          backgroundColor: '#ecf0f1',
                          marginLeft: '5px',
                          flexGrow: 1 // 이미지 비율에 맞춰 축소
                        }}
                      >
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <img 
                            src={item.videoCrop} 
                            alt="Detected" 
                            style={{ width: '70%', height: 'auto' }} // 40% 크기로 축소
                          />
                          <Typography variant="caption" align="center" style={{ color: 'black', marginTop: '10px' }}>크롭된 이미지</Typography>
                        </Box>
                      </Paper>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Below: Doughnut chart and Video */}
                  <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent sx={{ height: '200px' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: -4, position: 'relative' }}>
                            <Box sx={{ width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                              <Box sx={{ position: 'absolute', textAlign: 'center', top: '63%', transform: 'translateY(-50%)' }}>
                                <Typography variant="h5" color="green">{item.similarity.toFixed(2)}%</Typography>
                                <Typography variant="h5" color="green">Score</Typography>
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
                                <source src={`video/${item.videoName}/${item.videoName}`} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                                <strong>Video: {item.videoName || 'N/A'}</strong>
                              </Typography>
                              <Typography><strong>Detection Time: {item.time || 'N/A'}</strong></Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>

                {/* Delete Icon Positioned at Bottom Right */}
                <IconButton 
                  onClick={() => deleteHistory(item.id)} 
                  style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '10px', 
                      color: '#f44336' 
                    }}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            );
          })
        ) : (
          <Typography align="center" style={{ color: 'black', marginTop: '50px' }}>No history found.</Typography>
        )}

        <Box display="flex" justifyContent="center" alignItems="center" marginTop="20px">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button 
              key={index} 
              variant={currentPage === index ? "contained" : "outlined"} 
              color="primary" 
              onClick={() => handlePageChange(index)} 
              style={{ margin: '0 5px' }}
            >
              {index + 1}
            </Button>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default History3;
