import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Profile.css'; // Додаємо окремий файл CSS для стилізації
import Sidebar from '../Sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { useTheme } from '../../services/ThemeContext';

interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  external_urls: { spotify: string };
  followers: { total: number };
  href: string;
  id: string;
  images: { url: string }[];
  uri: string;
  product: string; // Для перевірки на Premium
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPremium, setIsPremium] = useState(false); // Статус Premium акаунта
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('access_token');

    if (token) {
      console.log('Access token found in URL:', token);
      localStorage.setItem('spotifyAccessToken', token); // Зберігаємо токен у localStorage
      fetchProfile(token);
    } else {
      const storedToken = localStorage.getItem('spotifyAccessToken');
      if (storedToken) {
        console.log('Access token found in localStorage:', storedToken);
        fetchProfile(storedToken);
      } else {
        console.error('No access token found, redirecting to login');
        navigate('/'); // Редірект на логін, якщо немає токена
      }
    }
  }, [location, navigate]);

  const fetchProfile = async (accessToken: string) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const userProfile = response.data;
      setProfile(userProfile);
      setIsPremium(userProfile.product === 'premium'); // Перевірка на Premium акаунт
      setLoading(false);
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        console.error('Access denied. This token does not have permission.', error);
        setError('Access denied. This functionality is restricted to Premium users or invalid token.');
      } else {
        console.error('Error fetching profile data', error);
        setError('Failed to fetch profile data. Please try again.');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return (
      <div className='page'>
        <div className="subscription-card-d">
          <h2 className='h2'>Схоже у вас безкоштовний обліковий запис</h2>
          <h4 className='h22'>Для використання програми вам потрібно придбати PREMIUM</h4>

          <button
            className="premium-btn-d"
            onClick={() => {
              window.location.href = 'https://www.spotify.com/premium/';
            }}
          >
            Придбати Spotify Premium
          </button>
        </div>
      </div>

    );
  }

  if (!profile) {
    return <div>No profile data available.</div>;
  }

  return (
    <div >
      <div className={`page ${isDarkMode ? 'dark' : 'light'}`}>
        <Sidebar />
        <h2 className={`zah ${isDarkMode ? 'dark' : 'light'}`}>Керуйте своєю підпискою</h2>
        <div>
          <div  className={`subscription-card ${isDarkMode ? 'dark' : 'light'}`}>
            <h3>Ваш план</h3>
            <h1>{isPremium ? 'Spotify Premium' : 'SymphoNix безкоштовно'}</h1>
            <ul>
              {isPremium ? (
                <>
                  <li>● Без реклами</li>
                  <li>● Відтворення музики без перерв</li>
                  <li>● Необмежений доступ до треків</li>
                  <li>● Висока якість звуку</li>
                </>
              ) : (
                <>
                  <li>1 безкоштовний обліковий запис</li>
                  <li>Прослуховування музики з рекламними паузами</li>
                  <li>Лише потокове передавання</li>
                  <li>Пісні відтворюються у випадковому порядку</li>
                  <li>Базова якість звуку</li>
                </>
              )}
            </ul>
            <div className='cena'>{isPremium ? 'платно' : 'безкоштовно'}</div>
          </div>
          <Link to={`/home`}>
            <button
              className="premium-btn"

            >
              Використовувати SyphoNix
            </button>
          </Link>
        </div>
        {!isPremium && (
          <button
            className="premium-btn"
            onClick={() => {
              window.location.href = 'https://www.spotify.com/premium/';
            }}
          >
            Приєднатися до Premium
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
