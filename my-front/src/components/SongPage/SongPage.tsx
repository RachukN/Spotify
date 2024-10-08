import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../Navigation/TopNavigation';
import Footer from '../Footer/Footer';
import PlayerControls from '../Player/PlayerControls';
import Play from '../../images/Frame 76.png';
import Seting from '../Home/Images/Frame 129.png';
import bannerImage from '../Home/Images/Frame 148 (2).png';
import LeftGray from '../Main/Images/Frame 73.png';
import RightGray from '../Main/Images/Frame 72 (1).png';
import LeftGreen from '../Main/Images/Frame 73 (1).png';
import RightGreen from '../Main/Images/Frame 72.png';
import '../../styles/SongPage.css'; // Використовуємо стилі сторінки артиста
import LoadingPageWithSidebarT from '../Loading/LoadingTrackPage';
import { useTheme } from '../../services/ThemeContext';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook




interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string; id: string }[];
  release_date: string;
  tracks: {
    items: { name: string; duration_ms: number; uri: string }[];
  };
}

interface Recommendation {
  id: string;
  name: string;
  artists: { name: string, id: string; }[];
  album: { name: string, id: string; images: { url: string }[] };
  uri: string;
  duration_ms: number;
  popularity: number;
}

interface Single {
  id: string;
  name: string;
  images: { url: string }[];
  release_date: string;
  uri: string;
}

interface RelatedArtist {
  id: string;
  name: string;
  images: { url: string }[];
  popularity: number;
  uri: string;
}
interface Device {
  id: string;
  is_active: boolean;
}


const SongPage: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [singles, setSingles] = useState<Single[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<RelatedArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leftArrowSingles, setLeftArrowSingles] = useState(LeftGray);
  const [rightArrowSingles, setRightArrowSingles] = useState(RightGreen);
  const [leftArrowRelated, setLeftArrowRelated] = useState(LeftGray);
  const [rightArrowRelated, setRightArrowRelated] = useState(RightGreen);
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const [isAlbumSaved, setIsAlbumSaved] = useState(false);


  const scrollRefSingles = useRef<HTMLDivElement>(null);
  const scrollRefRelated = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        // Отримуємо дані альбому
        const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlbum(albumResponse.data);

        // Отримуємо рекомендації на основі першого треку альбому
        const trackUri = albumResponse.data.tracks.items[0].uri.split(':').pop(); // отримуємо трек ID
        const recommendationsResponse = await axios.get(`https://api.spotify.com/v1/recommendations`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            seed_tracks: trackUri,
            limit: 5,
          },
        });
        setRecommendations(recommendationsResponse.data.tracks);

        // Отримуємо сингли
        const singlesResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${albumResponse.data.artists[0].id}/albums?include_groups=single&market=US`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSingles(singlesResponse.data.items);
        const savedResponse = await axios.get(
          `https://api.spotify.com/v1/me/albums/contains?ids=${albumId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsAlbumSaved(savedResponse.data[0]);
        // Отримуємо схожих артистів
        const relatedArtistsResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${albumResponse.data.artists[0].id}/related-artists`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRelatedArtists(relatedArtistsResponse.data.artists);
      } catch (error) {
        console.error('Failed to fetch album data or recommendations.', error);
        setError('Failed to fetch album data or recommendations.');
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      fetchAlbumData();
    }
  }, [albumId]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayTrack = async (uri: string) => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) return;

    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        { uris: [uri] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Failed to play track.', error);
    }
  };

  const updateArrowsSingles = () => {
    if (scrollRefSingles.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRefSingles.current;
      if (scrollLeft === 0) {
        setLeftArrowSingles(LeftGray);
        setRightArrowSingles(RightGreen);
      } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
        setLeftArrowSingles(LeftGreen);
        setRightArrowSingles(RightGray);
      } else {
        setLeftArrowSingles(LeftGreen);
        setRightArrowSingles(RightGreen);
      }
    }
  };

  const updateArrowsRelated = () => {
    if (scrollRefRelated.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRefRelated.current;
      if (scrollLeft === 0) {
        setLeftArrowRelated(LeftGray);
        setRightArrowRelated(RightGreen);
      } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
        setLeftArrowRelated(LeftGreen);
        setRightArrowRelated(RightGray);
      } else {
        setLeftArrowRelated(LeftGreen);
        setRightArrowRelated(RightGreen);
      }
    }
  };

  const scrollLeftSingles = () => {
    if (scrollRefSingles.current) {
      scrollRefSingles.current.scrollBy({
        left: -scrollRefSingles.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrowsSingles, 300);
    }
  };

  const scrollRightSingles = () => {
    if (scrollRefSingles.current) {
      scrollRefSingles.current.scrollBy({
        left: scrollRefSingles.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrowsSingles, 300);
    }
  };

  const scrollLeftRelated = () => {
    if (scrollRefRelated.current) {
      scrollRefRelated.current.scrollBy({
        left: -scrollRefRelated.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrowsRelated, 300);
    }
  };
  const handleSaveOrRemoveAlbum = async () => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) return;

    try {
      if (isAlbumSaved) {
        // Remove the album from the user's library
        await axios.delete(`https://api.spotify.com/v1/me/albums`, {
          headers: { Authorization: `Bearer ${token}` },
          data: {
            ids: [albumId], // Pass the album ID as an array
          },
        });
      } else {
        // Save the album to the user's library
        await axios.put(`https://api.spotify.com/v1/me/albums`, {
          ids: [albumId], // Pass the album ID as an array
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setIsAlbumSaved(!isAlbumSaved); // Toggle the saved status
    } catch (error) {
      console.error('Failed to save or remove album.', error);
    }
  };
  const getActiveDeviceId = async (): Promise<string | null> => {
    const token = localStorage.getItem('spotifyAccessToken');

    if (!token) {
      console.error('No access token found');
      return null;
    }

    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const devices: Device[] = response.data.devices;
      if (devices.length === 0) {
        console.error('No active devices found');
        return null;
      }

      const activeDevice = devices.find((device: Device) => device.is_active);
      return activeDevice ? activeDevice.id : devices[0].id;
    } catch (error) {
      console.error('Error fetching devices:', error);
      return null;
    }
  };
  const handlePlayAlbum = async (albumUri: string) => {
    const token = localStorage.getItem('spotifyAccessToken');

    if (!token) {
      console.error('No access token found');
      return;
    }

    const deviceId = await getActiveDeviceId();
    if (!deviceId) {
      alert('Please open Spotify on one of your devices to start playback.');
      return;
    }

    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          context_uri: albumUri,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Album is playing');
    } catch (error: any) {
      console.error('Error playing album:', error?.response || error.message || error);
      if (error.response && error.response.status === 404) {
        // Retry logic for specific errors
        console.log('Retrying to connect player...');
        setTimeout(() => handlePlayAlbum(albumUri), 2000); // Retry after delay
      }
    }
  };
  const scrollRightRelated = () => {
    if (scrollRefRelated.current) {
      scrollRefRelated.current.scrollBy({
        left: scrollRefRelated.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrowsRelated, 300);
    }
  };

  if (loading) {
    return <div><LoadingPageWithSidebarT /></div>;
  }

  if (!album) {
    return <div>Album data not available.</div>;
  }

  const profileImageUrl = album.images.length > 0 ? album.images[0].url : 'default-album.png';
  return (
    <div className="main-container-s">
      <div className="sidebar-s">
        <Sidebar />
      </div>

      <div className={`content-s ${isDarkMode ? 'dark' : 'light'}`}
      >
        <TopNavigation />

        {/* Album Banner */}
        <div className="banner-container-user-s">
          <img src={bannerImage} alt="Banner" className="banner-image-user-s" />
        </div>

        {/* Album Details Section */}
        <div className="inf-s">
          <img src={profileImageUrl} alt={album.name} className="profile-image-s" />
          <div className="name-s">
            <div className="title-s">{language.albums}</div>
            <h1>{album.name}</h1>
            <div className={`profile-details-s ${isDarkMode ? 'dark' : 'light'}`}
            >  <p className="title-s">
                {album.artists.map((artist) => artist.name).join(', ')}
                <div className="marg-5">|</div>
              </p>
              <p>
                {album.name}
                <div className="marg-5">|</div>
              </p>
              <p>{`${album.release_date}`}

              </p>

            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="seting-s">
          <img src={Seting} alt="Seting" className="seting-img" />
          <button
            onClick={handleSaveOrRemoveAlbum}
            className={isAlbumSaved ? 'subscribed-s' : 'subscribe-button-s'}
          >
            {isAlbumSaved ? language.removeFromFavorites : language.addToFavorites}
          </button>
        </div>



        {/* Recommendations Section */}
        <div className="cont-a">
          <div className="top-tracks">
            <h2 className={`popularity ${isDarkMode ? 'dark' : 'light'}`}>{language.recommendationsBasedOnTrack}</h2>
            <ul className="tracks-list">
              {recommendations.slice(0, 5).map((rec, index) => (
                <li className={` track-item ${isDarkMode ? 'dark' : 'light'}`}  // Play track on image click
                  key={`${rec.id}-${index}`}
                >
                  <span className="track-index">{index + 1}</span>
                  <img
                    src={rec.album.images[0]?.url || "default-album.png"}
                    alt={rec.name}
                    className="track-image"
                    key={rec.id}
                    onClick={() => handlePlayTrack(rec.uri)}
                    style={{ margin: '10px 0', cursor: 'pointer' }}
                  // Optionally change the cursor to indicate the image is clickable
                  />
                  <div className="track-info">

                    <Link key={rec.album.id} to={`/album/${rec.album.id}`}>
                      <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>
                        {rec.album.name}
                      </span>
                    </Link>
                    <p className="track-artists">
                      {rec.artists.map(artist => (
                        <Link key={artist.id} to={`/artist/${artist.id}`}>
                          <span className={`result-name ${isDarkMode ? 'dark' : 'light'}`}>
                            {artist.name}
                          </span>
                        </Link>
                      ))}
                    </p>
                  </div>
                  <div className={`track-album ${isDarkMode ? 'dark' : 'light'}`}
                  >{rec.popularity}</div>

                  <div className={`track-duration ${isDarkMode ? 'dark' : 'light'}`}>{rec.duration_ms ? formatDuration(rec.duration_ms) : 'Unknown'}</div>
                  <div onClick={() => handlePlayTrack(rec.uri)} className="play-icona">
                    <img src={Play} alt="Play" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Singles Section with Scroll */}
        <h2 className={`popularity ${isDarkMode ? 'dark' : 'light'}`}>{language.singles}</h2>
        <div className="cont-sa">
          <div style={{ position: "relative", width: "100%" }}>
            <img
              src={leftArrowSingles}
              alt="Scroll Left"
              className="img-l"
              onClick={scrollLeftSingles}
            />
            <img
              src={rightArrowSingles}
              alt="Scroll Right"
              className="img-r"
              onClick={scrollRightSingles}
            />
            <div
              ref={scrollRefSingles}
              className="music-c"
              onScroll={updateArrowsSingles}
            >
              {singles.map((single) => (
                <div key={single.id} className="img-container">
                  <div className="img-content">
                    <img
                      src={single.images[0]?.url || "default-single.png"}
                      alt={single.name}
                      className="m-5m"
                      onClick={() => handlePlayTrack(single.uri)} // Play track on image click
                      style={{ cursor: 'pointer' }}
                    />
                    <div onClick={() => handlePlayAlbum(single.uri)} className="play-icona">
                      <img src={Play} alt="Play" />
                    </div>
                    <Link key={single.id} to={`/album/${single.id}`}>
                      <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>
                        {single.name.length > 16 ? `${single.name.substring(0, 12)}...` : single.name}
                      </span>
                    </Link>
                    <p className="release-date">{single.release_date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Artists Section with Scroll */}
        <h2 className={`popularity ${isDarkMode ? 'dark' : 'light'}`}>{language.similarArtists}</h2>
        <div className="cont-sa">
          <div style={{ position: "relative", width: "100%" }}>
            <img
              src={leftArrowRelated}
              alt="Scroll Left"
              className="img-l"
              onClick={scrollLeftRelated}
            />
            <img
              src={rightArrowRelated}
              alt="Scroll Right"
              className="img-r"
              onClick={scrollRightRelated}
            />
            <div
              ref={scrollRefRelated}
              className="music-c"
              onScroll={updateArrowsRelated}
            >
              {relatedArtists.map((artist) => (
                <div key={artist.id} className="img-container">
                  <div className="img-contenta">
                    <img
                      src={artist.images[0]?.url || "default-artist.png"}
                      alt={artist.name}
                      className="m5m"
                    />
                  </div>
                  <Link to={`/artist/${artist.id}`}>
                    <div className="play-iconaa" />
                  </Link>
                  <Link to={`/artist/${artist.id}`}>
                    <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>
                      {artist.name.length > 16 ? `${artist.name.substring(0, 12)}...` : artist.name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </div>

        <Footer />
      </div>

      <div className="filter-user-s">
        <TopNavigation />
      </div>

      <div className="player-s">
        <PlayerControls />
      </div>
    </div>
  );
};
export default SongPage;