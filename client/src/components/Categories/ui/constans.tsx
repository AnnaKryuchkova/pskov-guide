import React from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import '../category.css';
import 'leaflet/dist/leaflet.css';
import '@mantine/carousel/styles.css';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

export const createImageMarker = (imageUrl: string, size = 100) => {
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 20%;
        border: 2px solid white;
        background-image: url('${imageUrl}');
        background-size: cover;
        background-position: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
};

export const MapContent = ({ places }) => {
  const map = useMap();

  React.useEffect(() => {
    if (places?.length) {
      const bounds = L.latLngBounds(places.map((place) => [place.latitude, place.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [places, map]);

  return null;
};

export const showSuccessNotification = () => {
  notifications.show({
    title: 'Успех!',
    message: 'Запрос был выполнен успешно',
    color: 'teal',
    icon: <IconCheck size={20} />,
    withCloseButton: true,
  });
};

export const showErrorNotification = (error?: string) => {
  notifications.show({
    title: 'Ошибка',
    message: error || 'Не удалось выполнить запрос. Попробуй еще раз.',
    color: 'red',
    icon: <IconX size={20} />,
    withCloseButton: true,
  });
};
