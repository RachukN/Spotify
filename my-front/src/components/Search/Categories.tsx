import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Categories.css'; // Підключаємо стилі
import { useTheme } from '../../services/ThemeContext';
import { useLanguage } from '../../services/LanguageContext'; // Import language hook

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]); // Використовуємо стан для зображень
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
 
  // Завантажуємо зображення з API
  useEffect(() => {
    fetch('https://localhost:5051/api/Image/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Received data from API:", data); // Лог для перевірки отриманих даних

        // Мапуємо отримані дані в категорії
        const mappedCategories = data.map((image: any, index: number) => ({
          id: image.id || `${image.fileName}-${index}`, // Унікальний ключ для кожного зображення
          name: image.fileName.split('.')[0], // Назва категорії — це ім'я файлу без розширення
          image: `data:${image.contentType};base64,${image.data}`, // Формуємо URL для зображення
          route: `/category/${image.fileName.split('.')[0].toLowerCase()}`, // Динамічний маршрут
        }));

        setCategories(mappedCategories); // Оновлюємо стан із отриманими категоріями
      })
      .catch((error) => console.error('Error fetching categories:', error)); // Обробка помилок
  }, []);

  // Обробник кліку по категорії
  const handleCategoryClick = (route: string) => {
    navigate(route); // Переходимо до вибраної категорії
  };

  return (
    <div className="categories-container">
      <h2  className={`categories-title ${isDarkMode ? 'dark' : 'light'}`}
      >{language.allCatalog}</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id} // Використовуємо унікальний id для ключа
            className="category-card"
            onClick={() => handleCategoryClick(category.route)} // Обробка кліку
          >
            <img src={category.image} alt={category.name} className="category-image" />
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
