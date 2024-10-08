// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Callback from './components/Auth/Callback';
import Profile from './components/UserProfil/Profile';
import Categories from './components/Search/Categories';
import { GlobalPlayerProvider } from './components/Player/GlobalPlayer';
import MainPage from './components/Main/Mainpage';
import Search from './components/Search/Search';
import SearchResults from './components/Search/SearchResults';
import UserProfile from './components/UserProfil/UserProfile';
import InfoMusic from './components/InfoMusic/InfoMusic';
import Layout from './components/Player/Layout';
import ArtistPage from './components/ArtistsPage/ArtistPage';
import AlbumPage from './components/SongPage/SongPage';
import TrackPage from './components/SongPage/TrackPage';
import FavoritesPage from './components/SongPage/FavoritesPage';
import PlaylistsPage from './components/SongPage/PlaylistsPage';
import PlaylistDetailsPage from './components/SongPage/PlaylistDetailsPage';
import SubscriptionPage from './components/UserProfil/SubscriptionPage';
import EditProfile from './components/UserProfil/EditProfile';
import PremiumRequired from './components/UserProfil/PremiumRequired';
import LoadingTrackPage from './components/Loading/LoadingTrackPage';
import NewAdmin from './components/Admin/NewAdmin';
import { ThemeProvider } from './services/ThemeContext';
import { LanguageProvider } from './services/LanguageContext';
import AdminPanel from './components/Admin/AdminPanel';

const App: React.FC = () => {
  
  return (
    <LanguageProvider>
    <ThemeProvider>
    <GlobalPlayerProvider>
    
    <Router>
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/categories" element={<Categories />} /> 
        <Route path="/searchh" element={<Search />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/infomusic" element={<InfoMusic />} />
        <Route path="/artist/:artistId" element={<ArtistPage />} />
        <Route path="/album/:albumId" element={<AlbumPage />} />
        <Route path="/track/:trackId" element={<TrackPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/playlists" element={<PlaylistsPage />} />
        <Route path="/playlist/:id" element={<PlaylistDetailsPage/>} />
        <Route path="/profileseting" element={<SubscriptionPage/>} />
        <Route path="/editprofile" element={<EditProfile/>} />
        <Route path="/premium-required" element={<PremiumRequired/>} />
        <Route path="/loading" element={<LoadingTrackPage/>} />
        <Route path="/admi" element={<NewAdmin/>} />
        
        
        
        
        </Route>
      </Routes>
    </Router>
    
    </GlobalPlayerProvider>
    </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
