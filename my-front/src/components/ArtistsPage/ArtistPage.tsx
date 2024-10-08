import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import bannerImage from '../Home/Images/Frame 148 (2).png';
import TopNavigation from '../Navigation/TopNavigation';
import Footer from '../Footer/Footer';
import PlayerControls from '../Player/PlayerControls';
import Seting from '../Home/Images/Frame 129.png';
import { GlobalPlayerProvider } from '../Player/GlobalPlayer';
import '../../styles/ArtistPage.css';
import LoadingPageWithSidebarA from '../Loading/LoadingTrackPageA';
import { useTheme } from '../../services/ThemeContext';
import ArtistTopTracks from '../Templates/ArtistTopTracks';
import ArtistSinglesList from '../Templates/ArtistSinglesList';
import SpotifyContentListArtist from '../Templates/SpotifyContentListArtist';
import { handlePlayTrack, handlePlayAlbum } from '../../utils/SpotifyPlayer';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook


interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
  genres: string[];
  popularity: number;
}

interface Track {
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
const ArtistPage: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [singles, setSingles] = useState<Single[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<RelatedArtist[]>([]);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();



  useEffect(() => {
    const fetchArtistData = async () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (!token) {
        setError('No access token found');
        return;
      }

      try {
        const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArtist(artistResponse.data);

        const topTracksResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopTracks(topTracksResponse.data.tracks.slice(0, 5));

        const singlesResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=single&market=US`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSingles(singlesResponse.data.items);
        const followingResponse = await axios.get(
          `https://api.spotify.com/v1/me/following/contains`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              type: 'artist',
              ids: artistId,
            },
          }
        );
        setIsFollowing(followingResponse.data[0]); // Assumes a single ID was passed
        const relatedArtistsResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRelatedArtists(relatedArtistsResponse.data.artists);
      } catch (error) {
        console.error('Failed to fetch artist data.', error);
        setError('Failed to fetch artist data.');
      }
    };

    if (artistId) {
      fetchArtistData();
    }
  }, [artistId]);


  const handleSubscribe = async () => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) return;

    try {
      if (isFollowing) {
        // Unfollow the artist
        await axios.delete(`https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Follow the artist
        await axios.put(
          `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setIsFollowing(!isFollowing); // Toggle follow state
    } catch (error) {
      console.error('Failed to update following status', error);
    }
  };









  if (error) {
    return <div>{error}</div>;
  }

  if (!artist) {
    return <div><LoadingPageWithSidebarA /></div>;
  }

  const profileImageUrl = artist.images.length > 0 ? artist.images[0].url : '';

  return (
    <div className="main-container-a">
      <div className="sidebar-a">
        <Sidebar />
      </div>

      <div className={`content-a ${isDarkMode ? 'dark' : 'light'}`}
      >
        <div className="banner-container-user-a">
          <img src={bannerImage} alt="Banner" className="banner-image-user-a" />
        </div>

        <div className="inf-a">
          <img
            key={artist.id}
            src={profileImageUrl}
            alt={artist.name}
            className="profile-image-a"
          />
          <div className={`name-a ${isDarkMode ? 'dark' : 'light'}`}
          >
            <div className="title-a">{language.performer}</div>
            <div className={`profile-details-a ${isDarkMode ? 'dark' : 'light'}`}>
              <h1>{artist.name}</h1>
              <p className="title-a">{artist.followers.total} {language.listeners}</p>
            </div>
          </div>
        </div>

        <div className="seting-a">

          <img src={Seting} alt="Seting" className="seting-img" />
          <button

            onClick={handleSubscribe}
            className={isFollowing ? ' subscribed' : 'subscribe-button'}
          >
            {isFollowing ? language.subscribed : language.subscribe }
          </button>
        </div>
        <h2 className={`popularity ${isDarkMode ? 'dark' : 'light'}`}>{language.topTracks}</h2>
        <ArtistTopTracks
          tracks={topTracks}
          handlePlayTrack={handlePlayTrack}
          handlePlayAlbum={handlePlayAlbum}
        />


        {/* Singles Section with Scroll */}
        <h2 className={`popularity ${isDarkMode ? 'dark' : 'light'}`}>{language.singles}</h2>
        <div className='artist-m'>
          <ArtistSinglesList
            singles={singles}
            handlePlayAlbum={handlePlayAlbum}

          />
        </div>


        {/* Related Artists Section with Scroll */}
        <div className="results-section-a">
          <SpotifyContentListArtist
            artists={relatedArtists}
            title={language.similarArtists}
          />

        </div>
        <Footer />
      </div>

      <div className="filter-user-a">
        <TopNavigation />
      </div>

      <GlobalPlayerProvider>
        <div className="player-a">
          <PlayerControls />
        </div>
      </GlobalPlayerProvider>
    </div>
  );


};

export default ArtistPage;
