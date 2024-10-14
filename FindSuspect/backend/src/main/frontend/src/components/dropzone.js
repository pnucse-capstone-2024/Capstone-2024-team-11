import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CssBaseline, Grid, Box, Typography, IconButton, Button, SvgIcon } from '@mui/material';

const MyDropzone = ({ onDrop }) => {
  const onDropCallback = useCallback((acceptedFiles) => {
    onDrop(acceptedFiles);  // 부모 컴포넌트로부터 받은 onDrop 함수 호출
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onDropCallback });

  const inputBox = {
    width: '30vw',
    height: '40vh',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // 그림자
  };

  return (
    <div style={inputBox} {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <div style={{ textAlign: 'center', paddingTop: '20%' }}>
            <Button variant="contained"
              sx={{ width: 150, borderRadius: 3.5, backgroundColor: '#000000', fontFamily: 'Inter', color: '#F4F4F4', fontWeight: 'bold', boxShadow: 'none' }}>
              Upload File
            </Button>
            <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#000000', fontWeight: 'bold', marginTop: '13%' }}>
              or drop a file.
            </Typography>
            <Typography variant="subtitle2" sx={{ fontFamily: 'Inter', color: '#b0b0b0' }}>
              paste image or URL
            </Typography>
          </div>
      }
    </div>
  );
};

export default MyDropzone;
