import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import SpotifyContentListAlbum from '../Templates/SpotifyContentListAlbum';
import SpotifyContentListArtist from '../Templates/SpotifyContentListArtist';
import SpotifyContentListTrack from '../Templates/SpotifyContentListTrack';
import './SearchResults.css';
import { handlePlayAlbum, handlePlayTrackList, formatDuration } from '../../utils/SpotifyPlayer';
import Sidebar from '../Sidebar/Sidebar';
import SearchBar from './SearchBar';
import TopNavigation from '../Navigation/TopNavigation';
import BestBaner from '../../images/Frame 148 (2).png';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

interface TrackResult {
  id: string;
  name: string;
  popularity: number;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { id: string; name: string }[];
  duration_ms: number;
  uri: string;
}

interface AlbumResult {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string, id: string }[];
  uri: string;
}

interface ArtistResult {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
  uri: string;
}

const SearchResults: React.FC = () => {
  const [tracks, setTracks] = useState<TrackResult[]>([]);
  const [albums, setAlbums] = useState<AlbumResult[]>([]);
  const [artists, setArtists] = useState<ArtistResult[]>([]);
  const [bestMatch, setBestMatch] = useState<TrackResult | AlbumResult | ArtistResult | null>(null);
  const [topTracks, setTopTracks] = useState<TrackResult[]>([]);
  const [query, setQuery] = useState(''); // Додаємо стейт для запиту
  const { language } = useLanguage();
 
  const [error, setError] = useState('');
  const location = useLocation();



  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';
    setQuery(searchQuery); // Оновлюємо запит
    if (searchQuery) {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      axios
        .get(`https://api.spotify.com/v1/search`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { q: searchQuery, type: 'track,artist,album', limit: 10 },
        })
        .then((response) => {
          const { tracks, albums, artists } = response.data;
          const filteredTracks = tracks.items.filter((item: any) => item.album && item.album.images.length > 0);
          const filteredAlbums = albums.items.filter((item: any) => item.images.length > 0);
          const filteredArtists = artists.items.filter((item: any) => item.images.length > 0);

          setTracks(filteredTracks);
          setAlbums(filteredAlbums);
          setArtists(filteredArtists);

          // Визначити найкращий збіг (наприклад, перший результат)
          if (filteredArtists.length > 0) {
            setBestMatch(filteredArtists[0]);
          } else if (filteredTracks.length > 0) {
            setBestMatch(filteredTracks[0]);
          } else if (filteredAlbums.length > 0) {
            setBestMatch(filteredAlbums[0]);
          }
        })
        .catch((err) => {
          setError('Failed to fetch search results.');
          console.error(err);
        });
    }
  }, [location.search]);
  useEffect(() => {
    const fetchTopTracks = async (artistId: string) => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        const topTracksResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopTracks(topTracksResponse.data.tracks.slice(0, 4));
      } catch (err) {
        console.error('Error fetching artist top tracks:', err);
      }
    };

    if (bestMatch) {
      let artistId = '';
      if ('artists' in bestMatch) {
        artistId = bestMatch.artists[0].id; // Виконавець треку або альбому
      } else if ('id' in bestMatch) {
        artistId = bestMatch.id; // Якщо це артист
      }

      if (artistId) {
        fetchTopTracks(artistId);
      }
    }
  }, [bestMatch]);

  const trackUris = tracks.map((track: any) => track.uri);
  const handlePlay = (startUri: string) => {
    handlePlayTrackList(trackUris, startUri); // Play all tracks, starting from the clicked one
  };

  const renderBestMatch = () => {
    if (!bestMatch) return null;
  
    if ('artists' in bestMatch && 'album' in bestMatch) {
      // Це трек
      return (
        <div className="best-match">
          <h3>{language.bestMatch}</h3>
          <img src={bestMatch.album?.images[0]?.url} alt={bestMatch.name} />
          <p>{bestMatch.name}</p>
          <p>by {bestMatch.artists.map((artist) => artist.name).join(', ')}</p>
        </div>
      );
    } else if ('images' in bestMatch && 'artists' in bestMatch) {
      // Це альбом
      return (
        <div className="best-match">
          <h3 className='best-name'>{language.bestMatch}</h3>
          <img src={bestMatch.images[0]?.url} alt={bestMatch.name} />
          <p>{bestMatch.name}</p>
          <p>by {bestMatch.artists.map((artist) => artist.name).join(', ')}</p>
        </div>
      );
    } else if ('images' in bestMatch && !('album' in bestMatch)) {
      // Це артист
      return (
        <div className="best-match">

          <h3 className='best-name'>{language.bestMatch}</h3>
          <img className='best-img' src={bestMatch.images[0].url} alt={bestMatch.name} style={{ borderRadius: '50%' }} />
          <div className='best-details'>
          <p className='best-item'>{language.performer}</p>
          <p className='best-auth' >{bestMatch.name}</p>
          <p className="best-title">{bestMatch.followers.total} {language.listeners}</p>
            
          </div>
        </div>
      );
    }
  
    return null;
  };
  
  return (

    <div className="search-results-container">
      <Sidebar />
      
      {error && <p className="error-message">{error}</p>}
      <div className='best-result'>
        <img src={BestBaner} alt="BestBaner" />
        {renderBestMatch()}
        </div>
      <div className="results-section">
        <div className='pisen'>
      <h2 className="best-name-pisen">{language.songs}</h2>
        <ul className="tracks-list-search">
          {topTracks.map((track, index) => (
            <li key={`${track.id}-${index}`} className="track-item">
              <span className="track-index">{index + 1}</span>
              <img
                onClick={() => handlePlay(track.uri)}
                src={track.album.images[0]?.url || "default-album.png"}
                alt={track.name}
                className="track-image"
              />
              <div className="track-info">
                <p className="track-name">
                  <Link to={`/track/${track.id}`}>
                    <span className="name-title" style={{ margin: '10px 0', cursor: 'pointer' }}>
                      {track.name}
                    </span>
                  </Link>
                </p>
              </div>
              <div className="track-duration">{formatDuration(track.duration_ms)}</div>
              <div onClick={() => handlePlayAlbum(track.uri)} className="play-icona"></div>
            </li>
          ))}
        </ul>
        </div>
        {/* Artists Section */}
        <SpotifyContentListArtist
          artists={artists}

          title={language.artists}
        />

        {/* Albums Section */}
        <SpotifyContentListAlbum
          items={albums}
          handlePlay={handlePlayAlbum}
          title={language.albums}
        />

        {/* Tracks Section */}
        <SpotifyContentListTrack
          items={tracks}
          handlePlay={handlePlay}
          title={language.tracks}
        />
      </div>
      <div className='search'><SearchBar query={query} /></div>
      <div className='results-container'><TopNavigation /></div>

      
    </div>
  );
};

export default SearchResults;
