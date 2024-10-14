import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Card, CardContent, Grid, Paper, Divider, Button } from '@mui/material';
import UserHeaderAppBar from '../components/UserHeaderAppBar';

const History2 = () => {
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
        console.error('히스토리 데이터를 가져오는 중 오류 발생:', error);
      });
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <UserHeaderAppBar />
      <Container maxWidth="lg" style={{ marginTop: '30px', marginBottom: '30px' }}>
        <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 'bold', color: 'black' }}>History</Typography>

        {historyData.length > 0 ? (
          historyData.map((item, index) => {
            
            let rectangle = item.video_image; 
            if (rectangle.endsWith('_cropped.jpg')) {
              rectangle = rectangle.replace('_cropped.jpg', '_rectangle.jpg');
            } else if (rectangle.endsWith('.jpg')) {
              rectangle = rectangle.replace('.jpg', '_rectangle.jpg');
            }
            const rectangleImagePath = `video/${item.video_name}/${rectangle}`; 

            return (
              <Card key={index} style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: 'black', textAlign: 'left', marginBottom: '10px' }}>Record {index + 1}</Typography>
                  <Divider style={{ marginBottom: '20px' }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} style={{ paddingLeft: '50px', paddingTop: '30px' }}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: 'black', textAlign: 'left', marginBottom: '5px' }}>
                        <strong>비디오 이름:</strong>
                      </Typography>
                      <Typography variant="body1" style={{ marginBottom: '10px', color: 'black', textAlign: 'left', paddingLeft: '10px' }}>
                        {item.video_name}
                      </Typography>

                      <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: 'black', textAlign: 'left', marginBottom: '5px' }}>
                        <strong>시간:</strong>
                      </Typography>
                      <Typography variant="body1" style={{ marginBottom: '10px', color: 'black', textAlign: 'left', paddingLeft: '10px' }}>
                        {item.time}
                      </Typography>

                      <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: 'black', textAlign: 'left', marginBottom: '5px' }}>
                        <strong>유사도:</strong>
                      </Typography>
                      <Typography variant="body1" style={{ marginBottom: '10px', color: 'black', textAlign: 'left', paddingLeft: '10px' }}>
                        {item.similarity.toFixed(2)}%
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: 'black', marginBottom: '10px', textAlign: 'left' }}>
                        <strong>이미지:</strong>
                      </Typography>
                      <Box display="flex" justifyContent="space-around" alignItems="center">
                        <Paper variant="outlined" style={{ padding: '10px', textAlign: 'center', backgroundColor: '#ecf0f1', marginRight: '5px' }}>
                          <img src={item.imageName} alt="원본" style={{ width: '100%', maxWidth: '200px', height: 'auto', marginBottom: '10px' }} />
                          <Typography variant="caption" align="center" style={{ color: 'black' }}>입력 이미지</Typography>
                        </Paper>
                        <Paper variant="outlined" style={{ padding: '10px', textAlign: 'center', backgroundColor: '#ecf0f1', marginRight: '5px' }}>
                          <img src={item.imageRectangle} alt="크롭된 이미지" style={{ width: '100%', maxWidth: '200px', height: 'auto', marginBottom: '10px' }} />
                          <Typography variant="caption" align="center" style={{ color: 'black' }}>이미지 내 탐지된 객체</Typography>
                        </Paper>
                        <Paper variant="outlined" style={{ padding: '10px', textAlign: 'center', backgroundColor: '#ecf0f1' }}>
                          <img src={rectangleImagePath} alt="사각형 이미지" style={{ width: '100%', maxWidth: '200px', height: 'auto', marginBottom: '10px' }} />
                          <Typography variant="caption" align="center" style={{ color: 'black' }}>영상 내 탐지된 객체</Typography>
                        </Paper>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: 'black', marginTop: '20px', textAlign: 'center' }}>
                        <strong>속성 및 특징:</strong>
                      </Typography>
                      <table style={{ width: '100%', border: '1px solid #bdc3c7', marginTop: '10px', textAlign: 'center', color: 'black' }}>
                        <thead style={{ backgroundColor: '#ecf0f1', color: 'black' }}>
                          <tr>
                            <th style={{ padding: '10px', textAlign: 'left' }}>속성</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>원본 상위 5개</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>파일 상위 5개</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.attr_words.map((word, i) => (
                            <tr key={i}>
                              <td style={{ padding: '10px', borderBottom: '1px solid #bdc3c7', textAlign: 'left', color: 'black' }}>{word}</td>
                              <td style={{ padding: '10px', borderBottom: '1px solid #bdc3c7', textAlign: 'left', color: 'black' }}>{item.original_top5[i]}</td>
                              <td style={{ padding: '10px', borderBottom: '1px solid #bdc3c7', textAlign: 'left', color: 'black' }}>{item.file_top5[i]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography align="center" style={{ color: 'black', marginTop: '50px' }}>히스토리가 없습니다.</Typography>
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

export default History2;
