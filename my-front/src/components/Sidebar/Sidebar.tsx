import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

import HomeIcon from './Frame 41.png';
import SearchIcon from './Frame 57.png';
import LibraryIcon from './Frame 42.png';
import Logo from './SymphoNix logo.png';
import LikedTracksIcon from './Rectangle 2.png';
import Plus from './Default.png';
import { useTheme } from '../../services/ThemeContext';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook



interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
}

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[]; 
}

const Sidebar: React.FC = () => {
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);
  const [favoriteTracksCount, setFavoriteTracksCount] = useState<number>(0);
  const [favoriteArtists, setFavoriteArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
 
  // Стан для відстеження активних кнопок
  const [activeFilters, setActiveFilters] = useState({
    playlists: true,
    artists: true,
    albums: true,
  });

  useEffect(() => {
    const fetchSavedAlbumsTracksAndArtists = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        // Fetch saved albums
        const albumsResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 10 },
        });
        const albums = albumsResponse.data.items.map((item: any) => item.album);
        setSavedAlbums(albums);

        // Fetch favorite tracks
        const tracksResponse = await axios.get('https://api.spotify.com/v1/me/tracks', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 50 },
        });
        setFavoriteTracksCount(tracksResponse.data.total);

        // Fetch favorite artists
        const artistsResponse = await axios.get('https://api.spotify.com/v1/me/following?type=artist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const artists = artistsResponse.data.artists.items;
        setFavoriteArtists(artists);

        // Fetch playlists
        const playlistsResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const playlists = playlistsResponse.data.items.filter(
          (playlist: Playlist) => playlist.images && playlist.images.length > 0
        );
        setPlaylists(playlists);
      } catch (error) {
        console.error('Failed to fetch saved albums, tracks, artists, or playlists:', error);
      }
    };

    fetchSavedAlbumsTracksAndArtists();
  }, []);

  const getImageUrl = (item: Album | Artist | Playlist) => {
    if ('images' in item && Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0].url;
    }
    return 'default-image.png'; 
  };

  const toggleFilter = (filter: keyof typeof activeFilters) => {
    setActiveFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const renderFilteredContent = () => {
    return (
      <>
        {activeFilters.albums && (
          <>
            {savedAlbums.map((album) => (
              <div key={album.id} className="sidebar-item">
                <img src={getImageUrl(album)} alt={album.name} className="sidebar-item-img" />
                <div>
                  <p className="sidebar-item-title">{album.name}</p>
                  <p className="sidebar-item-subtitle">
                    {'artists' in album && album.artists.map((artist) => artist.name).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
        {activeFilters.artists && (
          <>
            {favoriteArtists.map((artist) => (
              <div key={artist.id} className="sidebar-item">
                <img src={getImageUrl(artist)} alt={artist.name} style={{borderRadius:'50%'}} className="sidebar-item-img" />
                <div>
                  <p className="sidebar-item-title">{artist.name}</p>
                </div>
              </div>
            ))}
          </>
        )}
        {activeFilters.playlists && (
          <>
            {playlists.map((playlist) => (
              <div key={playlist.id} className="sidebar-item">
                <img src={getImageUrl(playlist)} alt={playlist.name} className="sidebar-item-img" />
                <div>
                  <p className="sidebar-item-title">{playlist.name}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <div className={`sidebar ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="sidebar-header">
        <img src={Logo} alt="SymphoNix Logo" className="sidebar-logo" />
      </header>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/home" className="sidebar-link">
              <img src={HomeIcon} alt="Home" className="sidebar-icon-h" />
              {language.home}
            </Link>
          </li>
          <li>
            <Link to="/searchh" className="sidebar-link">
              <img src={SearchIcon} alt="Search" className="sidebar-icon" />
              {language.search}
            </Link>
          </li>
          <li>
            <div className="sidebar-link">
              <Link to="/playlists" className="sidebar-link">
                <img src={LibraryIcon} alt="Library" className="sidebar-icon" />
                {language.library}
                <img src={Plus} alt="Library" className="plus" />
              </Link>
            </div>
          </li>
        </ul>
      </nav>
      <div className="sidebar-buttons">
        <button
          className={`sidebar-button ${activeFilters.playlists ? 'active' : ''}`}
          onClick={() => toggleFilter('playlists')}
        >
          {language.playlists}
        </button>
        <button
          className={`sidebar-button ${activeFilters.artists ? 'active' : ''}`}
          onClick={() => toggleFilter('artists')}
        >
          {language.artists}
        </button>
        <button
          className={`sidebar-button ${activeFilters.albums ? 'active' : ''}`}
          onClick={() => toggleFilter('albums')}
        >
          {language.albums}
        </button>
      </div>

      <div className="sidebar-item">
        <div className="margin-5">
          <Link to="/favorites" className="sidebar-link">
            <img src={LikedTracksIcon} alt="Liked Tracks" className="sidebar-item-img" />
          </Link>
          <div>
            <p className="sidebar-item-title-s">{language.likedTracks}</p>
            <p className="sidebar-item-subtitle-s">
              {language.playlist} • {favoriteTracksCount} {language.songs}
            </p>
          </div>
        </div>
      </div>

      <section className="sidebar-contents">{renderFilteredContent()}</section>
    </div>
  );
};

export default Sidebar;
