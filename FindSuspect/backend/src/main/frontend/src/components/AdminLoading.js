import HeaderAppBar from './HeaderAppBar';
import { Container, Typography, CircularProgress } from '@mui/material';
import { useLoadingState } from '../context/LoadingContext';
import { useNavigate } from 'react-router-dom';

const AdminLoading = () => {

    return (
        <>
            <CircularProgress />     
            <Typography variant="body1" style={{marginTop: '20px'}}>
                    Loading...
            </Typography>
        </>
    );
};

export default AdminLoading;