import React, { useState } from 'react';
import axios from 'axios';
import MyDropzone from './dropzone';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLoadingState } from '../context/LoadingContext';

function FileUpload() {
    const [imageFile, setImages] = useState([]);
    const [videoFile, setVideos] = useState([]);
    const {loading, setLoading} = useLoadingState();
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

        const fileType = file2send[0].type.split('/')[0]; 
        const uploadUrl = fileType === 'image' ? '/api/upload/image' : '/api/upload/video';
        // if(fileType === 'image'){
        //     navigate('/userLoading2');
        // }
        console.log(file2send);
        
        axios.post(uploadUrl, formData, config)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    setLoading(false);
                    setIsDisabled(true);    
                    if (fileType === 'image') {
                        setImages([...imageFile, response.data.filePath]);
                        alert('이미지 업로드 완료');
                        navigate('/userloading2');
                    } else if (fileType === 'video') {
                        setVideos([...videoFile, response.data.filePath]);
                        alert('비디오 업로드 완료');
                        navigate('/');
                    }

                } else {
                    alert('파일 저장 실패');
                }
            })
            .catch(error => {
                console.error('파일 업로드 중 오류 발생:', error);
            });
    };

    const dropHandler = (files) => {
        setFile2send(files);
        console.log(files);
        setTimeout(() => {setIsDisabled(false);}, 1000);
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
                className="pulse" 
                variant="contained" 
                color="secondary" 
                sx={{ borderRadius: 5 }} 
                size="large"
                onClick={handleClick} 
                disabled={isDisabled} 
                style={{ marginTop: '30px', textTransform: 'none', fontWeight: 'bold' }}
            >
                {circleLoading ? <CircularProgress size={24} color="inherit" /> : "Check"}
            </Button>
            <Button 
                variant="contained" 
                color="primary" 
                sx={{ borderRadius: 5 }} 
                size="large"
                onClick={goToVideoList} 
                style={{ marginTop: '30px', marginLeft: '20px', textTransform: 'none', fontWeight: 'bold' }}
            >
                Video List
            </Button>
        </>
    );
}

export default FileUpload;
