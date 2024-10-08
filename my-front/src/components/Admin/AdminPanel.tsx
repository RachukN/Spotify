import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

interface User {
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

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null); // Зберігаємо ID вибраного плейлиста
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Для пагінації треків
  const [tracksPerPage] = useState(10); // Кількість треків на сторінку
  const [currentUserPage, setCurrentUserPage] = useState(1); // For user pagination
  const usersPerPage = 5; // Number of users per page
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sorting order state

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

      if (playlistsResponse.data.items && playlistsResponse.data.items.length > 0) {
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
      setSelectedPlaylistId(playlistId); // Зберігаємо вибраний плейлист
      setShowRecommendations(false); // При відкритті нового плейлиста приховуємо старі рекомендації
      setCurrentPage(1); // При кожному виборі нового плейлиста, повертаємось до першої сторінки
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
          seed_artists: '4NHQUGzhtTLFvgF5SZesLK', // Замініть на свій seed_artist
          limit: 10,
        },
      });

      setRecommendedTracks(recommendationsResponse.data.tracks);
      setShowRecommendations(true);
      setSelectedPlaylistId(playlistId); // Показуємо рекомендації для конкретного плейлиста
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
        {
          uris: [trackUri],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      fetchPlaylistTracks(playlistId); // Після додавання треку перезавантажуємо треки
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          tracks: [{ uri: trackUri }],
        },
      });

      fetchPlaylistTracks(playlistId); // Після видалення треку перезавантажуємо треки
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Refresh liked artists after deletion
      fetchUserLikedArtists(selectedUser!.id);
    } catch (error) {
      console.error('Error deleting artist:', error);
    }
  };

  // Function to delete favorite album
  const deleteFavoriteAlbum = async (albumId: string) => {
    try {
      const tokenResponse = await axios.get(`https://localhost:5051/api/UserProfile/${selectedUser?.id}/token`);
      const accessToken = tokenResponse.data.accessToken;

      await axios.delete(`https://api.spotify.com/v1/me/albums?ids=${albumId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Refresh liked albums after deletion
      fetchUserLikedAlbums(selectedUser!.id);
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  // Pagination logic for users
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Sort and filter logic
  const filteredAndSortedUsers = [...users]
    .filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const emailA = a.email.toLowerCase();
      const emailB = b.email.toLowerCase();
      if (sortOrder === 'asc') {
        return emailA > emailB ? 1 : -1;
      } else {
        return emailA < emailB ? 1 : -1;
      }
    });

  // Pagination logic for users
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
  return (
    <div className="admin-panel-container">
      <h1>Admin Panel</h1>
      <input
        type="text"
        placeholder="Search users by email, country, role..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="admin-panel-search"
      />
 <button onClick={toggleSortOrder}>
        Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
      </button>
<h2>Users</h2>
      <ul className="admin-panel-list">
        {currentUsers.map((user) => (
          <li key={user.id} className="admin-panel-item">
            <strong></strong>
            <button onClick={() => handleUserSelect(user)}>View Playlists</button>
          </li>
        ))}
      </ul>

      {users.length > usersPerPage && (
        <div className="pagination">
          <button onClick={handlePreviousUserPage} disabled={currentUserPage === 1}>Previous</button>
          <button onClick={handleNextUserPage} disabled={currentUserPage === totalUserPages}>Next</button>
        </div>
      )}

      {selectedUser && (
        <>
          <h3>User Details</h3>
          <p>Email: {selectedUser.email}</p>
          <p>Country: {selectedUser.country}</p>
          <p>Role: {selectedUser.role}</p>

          <h3>Liked Artists</h3>
          {artists.length > 0 ? (
            <div className="artist-list">
              {artists.map((artist) => (
                <div key={artist.id} className="artist-item">
                  <img src={artist.images[0]?.url} alt={artist.name} className="artist-image" />
                  <p>{artist.name}</p>
                  <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">Open in Spotify</a>
                  <button onClick={() => deleteFavoriteArtist(artist.id)}>Remove Artist</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No liked artists available.</p>
          )}

          <h3>Liked Albums</h3>
          {albums.length > 0 ? (
            <div className="album-list">
              {albums.map((album) => (
                <div key={album.id} className="album-item">
                  <img src={album.images[0]?.url} alt={album.name} className="album-image" />
                  <p>{album.name}</p>
                  <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">Open in Spotify</a>
                  <button onClick={() => deleteFavoriteAlbum(album.id)}>Remove Album</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No liked albums available.</p>
          )}


          <h3>Playlists</h3>
          {playlists.length > 0 ? (
            <div className="playlist-list">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="playlist-item">
                  <img src={playlist.images[0]?.url} alt={playlist.name} className="playlist-image" />
                  <strong>{playlist.name}</strong>
                  <button onClick={() => fetchPlaylistTracks(playlist.id)}>View Tracks</button>
                  <button onClick={() => fetchRecommendations(playlist.id)}>Show Recommendations</button>

                  {selectedPlaylistId === playlist.id && (
                    <>
                      <h4>Tracks in Playlist</h4>
                      <ul>
                        {currentTracks.map((track) => (
                          <li key={track.id}>
                            <strong>{track.name}</strong>
                            <button onClick={() => removeTrackFromPlaylist(playlist.id, track.uri)}>Remove</button>
                          </li>
                        ))}
                      </ul>

                      {tracks.length > tracksPerPage && (
                        <div className="pagination">
                          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                        </div>
                      )}

                      {showRecommendations && selectedPlaylistId === playlist.id && (
                        <>
                          <h4>Recommended Tracks</h4>
                          <ul>
                            {recommendedTracks.map((track) => (
                              <li key={track.id}>
                                <strong>{track.name}</strong>
                                <button onClick={() => addTrackToPlaylist(playlist.id, track.uri)}>Add to Playlist</button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No playlists available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
