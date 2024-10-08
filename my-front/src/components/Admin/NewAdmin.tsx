import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserImage from '../Main/Images/user-128.png';
import './Admin.css';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../Navigation/TopNavigation';
import BestBanner from '../../images/Frame 148 (2).png';
import LeftGray from '../Main/Images/Frame 73.png';
import RightGray from '../Main/Images/Frame 72 (2).png';
import LeftGreen from '../Main/Images/Frame 73 (2).png';
import RightGreen from '../Main/Images/Frame 72.png';
import { useTheme } from '../../services/ThemeContext';
import Close from '../Main/Images/close.png';

interface User {
  images: { url: string }[] | null;
  id: string;
  email: string;
  gender: string;
  birthDay: number;
  birthMonth: string;
  birthYear: number;
  country: string;
  region: string;
  role: string;
}

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  description: string;
  external_urls: { spotify: string };
}

interface Track {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    images: { url: string }[];
  };
  artists: { name: string }[];
  external_urls: { spotify: string };
  uri: string;
}

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

const SearchResults: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tracksPerPage] = useState(5);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const usersPerPage = 5;
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { isDarkMode } = useTheme();
  const [leftArrowSingles, setLeftArrowSingles] = useState(LeftGray);
  const [rightArrowSingles, setRightArrowSingles] = useState(RightGreen);
  const [leftArrowRelated, setLeftArrowRelated] = useState(LeftGray);
  const [rightArrowRelated, setRightArrowRelated] = useState(RightGreen);
  const scrollRefSingles = useRef<HTMLDivElement>(null);
  const scrollRefRelated = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get('https://localhost:5051/api/UserProfile/all');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const fetchUserPlaylists = async (userId: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${userId}/token`);
      const accessToken = tokenResponse.data.accessToken;

      const playlistsResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (playlistsResponse.data.items?.length > 0) {
        setPlaylists(playlistsResponse.data.items);
      } else {
        setPlaylists([]);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const fetchPlaylistTracks = async (playlistId: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${selectedUser?.id}/token`);
      const accessToken = tokenResponse.data.accessToken;

      const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setTracks(tracksResponse.data.items.map((item: any) => item.track));
      setSelectedPlaylistId(playlistId);
      setShowRecommendations(false);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };

  const fetchUserLikedArtists = async (userId: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${userId}/token`);
      const accessToken = tokenResponse.data.accessToken;

      const artistsResponse = await axios.get('https://api.spotify.com/v1/me/following?type=artist', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setArtists(artistsResponse.data.artists.items);
    } catch (error) {
      console.error('Error fetching liked artists:', error);
    }
  };

  const fetchUserLikedAlbums = async (userId: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${userId}/token`);
      const accessToken = tokenResponse.data.accessToken;

      const albumsResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setAlbums(albumsResponse.data.items.map((item: any) => item.album));
    } catch (error) {
      console.error('Error fetching liked albums:', error);
    }
  };

  const fetchRecommendations = async (playlistId: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${selectedUser?.id}/token`);
      const accessToken = tokenResponse.data.accessToken;

      const recommendationsResponse = await axios.get('https://api.spotify.com/v1/recommendations', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          seed_artists: '4NHQUGzhtTLFvgF5SZesLK',
          limit: 10,
        },
      });

      setRecommendedTracks(recommendationsResponse.data.tracks);
      setShowRecommendations(true);
      setSelectedPlaylistId(playlistId);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    fetchUserPlaylists(user.id);
    fetchUserLikedArtists(user.id);
    fetchUserLikedAlbums(user.id);
  };

  const addTrackToPlaylist = async (playlistId: string, trackUri: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${selectedUser?.id}/token`);
      const accessToken = tokenResponse.data.accessToken;

      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: [trackUri] },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      fetchPlaylistTracks(playlistId);
    } catch (error) {
      console.error('Error adding track:', error);
    }
  };

  const removeTrackFromPlaylist = async (playlistId: string, trackUri: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${selectedUser?.id}/token`);
      const accessToken = tokenResponse.data.accessToken;

      await axios({
        method: 'delete',
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { tracks: [{ uri: trackUri }] },
      });

      fetchPlaylistTracks(playlistId);
    } catch (error) {
      console.error('Error removing track:', error);
    }
  };

  const indexOfLastTrack = currentPage * tracksPerPage;
  const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
  const currentTracks = tracks.slice(indexOfFirstTrack, indexOfLastTrack);
 
  const totalPages = Math.ceil(tracks.length / tracksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const deleteFavoriteArtist = async (artistId: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${selectedUser?.id}/token`);
      const accessToken = tokenResponse.data.accessToken;

      await axios.delete(`https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Refresh liked artists after deletion
      fetchUserLikedArtists(selectedUser!.id);
    } catch (error) {
      console.error('Error deleting artist:', error);
    }
  };

  const deleteFavoriteAlbum = async (albumId: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${selectedUser?.id}/token`);
      const accessToken = tokenResponse.data.accessToken;

      await axios.delete(`https://api.spotify.com/v1/me/albums?ids=${albumId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Refresh liked albums after deletion
      fetchUserLikedAlbums(selectedUser!.id);
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const filteredAndSortedUsers = [...users]
    .filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const emailA = a.email.toLowerCase();
      const emailB = b.email.toLowerCase();
      return sortOrder === 'asc' ? (emailA > emailB ? 1 : -1) : (emailA < emailB ? 1 : -1);
    });

  const indexOfLastUser = currentUserPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredAndSortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);

  const handleNextUserPage = () => {
    if (currentUserPage < totalUserPages) {
      setCurrentUserPage(currentUserPage + 1);
    }
  };

  const handlePreviousUserPage = () => {
    if (currentUserPage > 1) {
      setCurrentUserPage(currentUserPage - 1);
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

  const scrollRightRelated = () => {
    if (scrollRefRelated.current) {
      scrollRefRelated.current.scrollBy({
        left: scrollRefRelated.current.clientWidth,
        behavior: 'smooth',
      });
      setTimeout(updateArrowsRelated, 300);
    }
  };
  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`https://localhost:5051/api/UserProfile/${userId}`);
      // Після видалення оновлюємо список користувачів
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
  return (
    <div className="search-results-container">
      <Sidebar />

      <div className="best-result">
        <img className="baneer" src={BestBanner} alt="BestBanner" />
        {selectedUser && (
          <div>
            <div className="best-match">
              <h3 className="best-name">Обраний користувач</h3>
              <div className="best-img">
                <img className="img-g" src={UserImage} alt="User" />
              </div>
              <div className="best-details">
                <p className="best-item">{selectedUser.email}</p>
                <p className="best-auth">{selectedUser.country}</p>
                <p className="best-title">Role: {selectedUser.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="results-section-a">
        <div className="pisen-a">
          {users.length > usersPerPage && (
            <div className="pagination">
              <button onClick={handlePreviousUserPage} disabled={currentUserPage === 1}>
                <img src={LeftGreen} alt="LeftGreen" />
              </button>
              <button className="knopka" onClick={toggleSortOrder}>
                Сортувати {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </button>
              <button onClick={handleNextUserPage} disabled={currentUserPage === totalUserPages}>
                <img src={RightGreen} alt="RightGreen" />
              </button>
            </div>
          )}

          <ul className="tracks-list-search">
            {currentUsers.map((user, index) => (
              <li key={`${user.id}-${index}`} onClick={() => handleUserSelect(user)} className="track-item">
                <span className="track-index">{index + 1}</span>
                <div className="border-r">
                  <img src={UserImage} alt="User" />
                </div>
                <div className="track-info">
                  <p className="track-name">
                    <span className="name-title" style={{ margin: '10px 0', cursor: 'pointer' }}>
                      {user.email}
                    </span>

                  </p>
                </div>
                <button onClick={() => deleteUser(user.id)}>Видалити</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="cont-a-a">
        <div className="top-tracks-a">
          <h2 className={`popularity ${isDarkMode ? 'dark' : 'light'}`}>Плейлисти</h2>

          <ul className="tracks-list-a">
            {playlists.map((playlist, index) => (
              <>
                <li key={`${playlist.id}-${index}`} className={` track-item ${isDarkMode ? 'dark' : 'light'}`}>
                  <span className="track-index">{index + 1}</span>
                  <img
                    src={playlist.images?.[0]?.url || 'default-album.png'}
                    alt={playlist.name}
                    className="track-image"
                    key={playlist.id}
                  />
                  <div className="track-info">
                    <p className="track-name-a">
                      <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>{playlist.name}</span>
                    </p>
                  </div>
                  <button onClick={() => fetchPlaylistTracks(playlist.id)}>View Tracks</button>
                  <button onClick={() => fetchRecommendations(playlist.id)}>Show Recommendations</button>
                </li>

                {selectedPlaylistId === playlist.id && (
                  <ul>
                    {tracks.length > tracksPerPage && (
                      <div className="pagination-a">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                          <img src={LeftGreen} alt="LeftGreen" />
                        </button>

                        <button className="pagination-r" onClick={handleNextPage} disabled={currentPage === totalPages}>
                          <img src={RightGreen} alt="RightGreen" />
                          </button>
                        </div>
                    )}
                    
                    {currentTracks.map((track, index) => (
                      <li key={`${track.id}-${index}`} className={` track-item-a ${isDarkMode ? 'dark' : 'light'}`}>
                        <span className="track-index">{index + 1}</span>
                        <img
                          src={track.album?.images?.[0]?.url || 'default-album.png'}
                          alt={track.name}
                          className="track-image"
                        />
                        <div className="track-info">
                          <p className="track-name-a">
                            <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>{track.name}</span>
                          </p>
                        </div>
                        <button onClick={() => removeTrackFromPlaylist(playlist.id, track.uri)}>Remove</button>
                      </li>
                    ))}

                    {showRecommendations && selectedPlaylistId === playlist.id && (
                      <>
                        {recommendedTracks.map((track, index) => (
                          <li key={`${track.id}-${index}`} className={` track-item-r ${isDarkMode ? 'dark' : 'light'}`}>
                            <span className="track-index">{index + 1}</span>
                            <img
                              src={track.album?.images?.[0]?.url || 'default-album.png'}
                              alt={track.name}
                              className="track-image"
                            />
                            <div className="track-info">
                              <p className="track-name-a">
                                <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>{track.name}</span>
                              </p>
                            </div>
                            <button onClick={() => addTrackToPlaylist(playlist.id, track.uri)}>Add to Playlist</button>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                )}
              </>
            ))}
          </ul>
        </div>

        <h2 className={`popularity ${isDarkMode ? 'dark' : 'light'}`}>Альбоми</h2>
        <div className="cont-saa">
          <div style={{ position: 'relative', width: '100%' }}>
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
              {albums.map((album) => (
                <div key={album.id} className="img-container-a">
                  <div className="img-content">
                    <img
                      src={album?.images?.[0]?.url || 'default-album.png'}
                      alt={album.name}
                      className="track-image-a"
                    />
                    <div onClick={() => deleteFavoriteAlbum(album.id)} className="play-icon-a">
                      <img src={Close} alt="Delete" />
                    </div>
                    <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>
                      {album.name.length > 16 ? `${album.name.substring(0, 12)}...` : album.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className={`popularity ${isDarkMode ? 'dark' : 'light'}`}>Артисти</h2>
        <div>
          <div style={{ position: 'relative', width: '100%' }}>
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
              {artists.map((artist) => (
                <div key={artist.id} className="img-container-a">
                  <div className="img-content">
                    <img
                      src={artist.images?.[0]?.url || 'default-single.png'}
                      alt={artist.name}
                      className="img-content-a"
                    />
                    <div onClick={() => deleteFavoriteArtist(artist.id)} className="play-icona-a">
                      <img src={Close} alt="Delete" />
                    </div>
                    <span className={`name-title ${isDarkMode ? 'dark' : 'light'}`}>
                      {artist.name.length > 16 ? `${artist.name.substring(0, 12)}...` : artist.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="results-container">
        <TopNavigation />
      </div>
    </div>
  );
};

export default SearchResults;

