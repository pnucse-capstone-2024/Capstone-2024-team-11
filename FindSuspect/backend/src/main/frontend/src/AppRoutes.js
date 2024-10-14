import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminUpload from './pages/AdminUpload';
//import AdminLoading from './pages/AdminLoading';
import UserLoading from './pages/UserLoading';
import UserUpload from './pages/UserUpload';
import Result from './pages/Result';

import Home from './pages/Home';
import EnterPassword from './pages/EnterPassword';
import History from './pages/History';
import Detail from './pages/Detail'
import History2 from './pages/History2'
import VideoList from './pages/VideoList'
import UserLoading2 from './pages/Userloading2';
import Summary from './pages/Summary';
import Detail_2 from './pages/Detail_2';
import History3 from './pages/History3';
import VideoListUser from './pages/VideoListUser';

const AppRoutes = () => {
    //<Route path="/adminLoading" element={<AdminLoading />} />
    return (
        <Routes>
            <Route path="/adminUpload" element={<AdminUpload />} />
            <Route path="/" element={<Home />} />
            <Route path="/result" element={<Result />} />
            <Route path="/userLoading" element={<UserLoading />} />
            <Route path="/userUpload" element={<UserUpload />} />
            <Route path='/password' element={<EnterPassword/>} />
            <Route path='/History' element={<History/>} />
            <Route path='/Detail' element={<Detail/>} />
            <Route path='/History2' element={<History2/>} />
            <Route path='/videolist' element={<VideoList/>} />
            <Route path='/userloading2' element={<UserLoading2/>} />
            <Route path='/summary' element={<Summary/>} />
            <Route path='/detail2' element={<Detail_2/>} />
            <Route path='/history3' element={<History3/>} />
            <Route path='/videolistuser' element={<VideoListUser/>}/>
        </Routes>
    );
};

export default AppRoutes;
