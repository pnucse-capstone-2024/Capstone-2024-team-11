const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS 활성화
app.use(cors());

// 정적 파일 제공을 위한 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer 저장소 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir;
        // 파일 유형에 따라 저장 경로 설정
        if (file.mimetype.startsWith('image')) {
            uploadDir = './uploads/image';
        } else if (file.mimetype.startsWith('video')) {
            uploadDir = './uploads/video';
        } else {
            // 지원되지 않는 파일 유형에 대한 예외 처리
            return cb(new Error('지원되지 않는 파일 유형입니다.'));
        }
        // 디렉토리가 존재하지 않으면 생성
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // 이미지와 비디오 파일만 허용
        if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
            cb(null, true);
        } else {
            cb(new Error('이미지 및 비디오 파일만 업로드할 수 있습니다.'), false);
        }
    }
});

// 이미지 업로드를 처리할 라우트
app.post('/api/upload/image', upload.single('file'), (req, res) => {
    try {
        res.status(200).json({
            success: true,
            filePath: req.file.path
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: '파일 업로드 실패',
            error: err.message
        });
    }
});

// 비디오 업로드를 처리할 라우트
app.post('/api/upload/video', upload.single('file'), (req, res) => {
    try {
        res.status(200).json({
            success: true,
            filePath: req.file.path
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: '파일 업로드 실패',
            error: err.message
        });
    }
});

app.get('/api/get/image', (req, res) => {
    const imageDir = path.join(__dirname, 'uploads', 'image');
    fs.readdir(imageDir, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: '이미지 경로를 가져오는 중 오류 발생', error: err.message });
        }
        const imagePaths = files.map(file => path.join('/uploads/image', file));
        res.status(200).json({ success: true, imagePaths });
    });
});
// api
app.get('/api/get/video', (req, res) => {
    const videoDir = path.join(__dirname, 'uploads', 'video');
    fs.readdir(videoDir, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: '비디오 경로를 가져오는 중 오류 발생', error: err.message });
        }
        const videoPaths = files.map(file => path.join('/uploads/video', file));
        res.status(200).json({ success: true, videoPaths });
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
