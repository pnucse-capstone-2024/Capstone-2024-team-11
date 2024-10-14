import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const ImageComponent = ({ resultData }) => {
    const [imagePath, setImagePath] = useState('');

    useEffect(() => {
        if (resultData.length > 0) {
            // 배열의 첫 번째 항목을 가져오기
            const firstItem = resultData[0];
            const firstKey = Object.keys(firstItem)[0]; // 첫 번째 항목의 키 추출
            const videoName = firstItem[firstKey].video_name; // video_name 추출
            
            // 경로 생성 (이미지 경로로 사용)
            const generatedImagePath = `/video/${videoName}/${firstKey}`;
            
            // 상태에 이미지 경로 설정
            setImagePath(generatedImagePath);
            console.log(generatedImagePath);
        }
    }, [resultData]);

    return (
        <>
            {imagePath ? (
                <img
                    src={imagePath}
                    alt="Latest"
                    style={{ width: '100%', height: '100%', objectFit: 'scale-down' }}
                />
            ) : (
                <Typography>No image available</Typography>
            )}
        </>
    );
};

export default ImageComponent;
