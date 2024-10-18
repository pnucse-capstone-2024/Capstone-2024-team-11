import React, { useState } from 'react';
import axios from 'axios';
import MyDropzone from './dropzone';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLoadingState } from '../context/LoadingContext';

function VideoUpload() {
    const [videoFile, setVideos] = useState([]);
    const { loading, setLoading } = useLoadingState();
    const [isDisabled, setIsDisabled] = useState(true);
    const [file2send, setFile2send] = useState([]);
    const [circleLoading, setCircleLoading] = useState(false);
    const navigate = useNavigate();
    let formData = new FormData();

    const handleClick = () => {
        setLoading(true);
        setCircleLoading(true);
        setIsDisabled(true);
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        };
        formData.set("file", file2send[0]);

        axios.post('/api/upload/video', formData, config)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    setLoading(false);
                    setIsDisabled(true);
                    setVideos([...videoFile, response.data.filePath]);
                    alert('비디오 업로드 완료');
                    navigate('/');
                } else {
                    alert('파일 저장 실패');
                }
            })
            .catch(error => {
                console.error('파일 업로드 중 오류 발생:', error);
            });
    };

    const dropHandler = (files) => {
        if (files && files.length > 0){
            const fileExtension = files[0].path.split('.').pop().toLowerCase();
            console.log(fileExtension);
            const allowedExtensions = ['mp4', 'avi', 'mov'];
            if (!allowedExtensions.includes(fileExtension)) {
                alert('지원하지 않는 형식입니다');
                setIsDisabled(true); // 버튼 비활성화 유지
            } else {
                setFile2send(files);
                console.log(files);
                setTimeout(() => {
                    setIsDisabled(false); // 버튼 활성화
                }, 1000);
            }
        }
        else {
            alert('파일을 선택해주세요');
            setIsDisabled(true); // 파일이 없을 경우 버튼 비활성화
        }
    };

    const goToVideoList = () => {
        navigate('/videolist'); 
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <MyDropzone onDrop={dropHandler} />
            </div>
            <Button 
                variant="contained" 
                color="secondary" 
                sx={{ borderRadius: 5 }} 
                size="large"
                onClick={handleClick} 
                disabled={isDisabled} 
                style={{ marginTop: '30px', textTransform: 'none', fontWeight: 'bold' }}
            >
                {circleLoading ? <CircularProgress size={24} color="inherit" /> : "비디오 업로드"}
            </Button>
            <Button 
                variant="contained" 
                color="primary" 
                sx={{ borderRadius: 5 }} 
                size="large"
                onClick={goToVideoList} 
                style={{ marginTop: '30px', marginLeft: '20px', textTransform: 'none', fontWeight: 'bold' }}
            >
                영상 목록
            </Button>
        </>
    );
}

export default VideoUpload;
