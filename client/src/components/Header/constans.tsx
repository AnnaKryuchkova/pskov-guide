import React from 'react';

const baseLinks = [
  { link: '/', label: 'Главная' },
  { link: '/categories', label: 'Путеводитель' },
];

// Only show these links if user is authenticated
const authLinks = [
  { link: '/profile', label: 'Профиль' },
  { link: '/likes', label: 'Избранное' },
  { link: '/moderation', label: 'Черновики' },
];

// Combine links based on auth status
export const allLinks = (isAuth: boolean): { link: string; label: string }[] => {
  return isAuth ? [...baseLinks, ...authLinks] : baseLinks;
};

// Текст для тултипа
export const loginTooltipText = (
  <div>
    После регистрации вам станут доступны:
    <ul style={{ margin: '5px 0 0 15px', padding: 0 }}>
      <li>Бронирование мероприятий</li>
      <li>Сохранение в избранное</li>
      <li>Добавление новых мест и многое другое</li>
    </ul>
  </div>
);
