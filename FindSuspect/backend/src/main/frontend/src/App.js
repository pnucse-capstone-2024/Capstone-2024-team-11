import './App.css';
import React from 'react';
import AppRoutes from './AppRoutes';
import {BrowserRouter} from "react-router-dom";
//import adminUpload from './pages/adminUpload';
import { LoadingContextProvider } from './context/LoadingContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF', // 툴바 색상
    },
    secondary: {
      main: '#000000', // 버튼 색상
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <LoadingContextProvider>
        <BrowserRouter>
          <AppRoutes/>
        </BrowserRouter>
      </LoadingContextProvider>
    </ThemeProvider>
  );
}

export default App;
