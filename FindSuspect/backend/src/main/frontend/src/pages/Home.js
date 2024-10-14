import HomeHeaderAppBar from "../components/HomeHeaderAppBar";
import { Container, Typography, Button, Box, Card, CardContent } from "@mui/material";
import home_image from '../picture/home_image.png'
import { useNavigate } from "react-router-dom";
import { useLoadingState } from "../context/LoadingContext";

const Home = () => {
    const navigate = useNavigate();
    const {loading, setLoading} = useLoadingState();

    const handleClick = () => {
        setLoading(true);
        navigate('userupload');
    };

    return (
        <>
        <HomeHeaderAppBar/>
        <Container maxWidth="md" style={{textAlign: 'center', marginTop: '50px'}}>
            <Typography className="landing-text" variant="h4" style={{marginBottom: '20px', fontWeight: 'bold'}}>
                Find Suspect from Video
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" >
                <Card sx={{ width: 600, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CardContent sx={{ width: '100%', height: '100%', padding: 0, marginTop: '25px' }}>
                        <img
                                src={`${home_image}`}
                                alt="Latest"
                                style={{ width: '100%', height: '100%', objectFit: 'scale-down' }}
                        />  
                    </CardContent>
                </Card>
            </Box>
            <Button className="pulse" variant="contained" color="secondary" sx={{ borderRadius: 5 }} size="large"
                    onClick={handleClick} style={{ marginTop: '30px', textTransform: 'none', fontWeight: 'bold' }}>
                    Image Upload
            </Button>
        </Container>
        </>
    );
};



export default Home;