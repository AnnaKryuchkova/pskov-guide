import React, { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMediaQuery } from '@mantine/hooks';
import { Image, Paper, Transition, useMantineTheme } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { UserLike } from '../../../redux/api/type';
const createImageMarker = (imageUrl: string, size = 100) => {
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
const MapContent = ({ place }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const map = useMap();
  React.useEffect(() => {
    if (place) {
      map.flyTo([place.latitude, place.longitude], 15);
    }
  }, [place, map]);

  return null;
};
interface MapPlaceProps {
  selectedPlace: UserLike['place']; // Используем тип места из UserLike
  userLike?: UserLike[]; // Массив лайков (опционально, если используется)
}

const MapPlace: React.FC<MapPlaceProps> = ({ selectedPlace, userLike }) => {
  const [show, setShow] = useState(true);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ width: '100%', height: '600px' }}>
        <MapContainer
          center={[selectedPlace?.latitude, selectedPlace?.longitude]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapContent place={selectedPlace} />

          <Marker
            eventHandlers={{
              click: () => setShow(true),
            }}
            key={userLike?.[0].place.id}
            position={[selectedPlace?.latitude, selectedPlace?.longitude]}
            icon={createImageMarker(selectedPlace?.mainPhoto || 'fallback-image-url')}
          ></Marker>
        </MapContainer>
      </div>
      <Transition mounted={show} transition="slide-up" duration={300} timingFunction="ease">
        {(styles) => (
          <div
            style={{
              ...styles,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
              padding: '1rem',
              overflowY: 'auto',
              zIndex: 990,
            }}
          >
            {selectedPlace && (
              <>
                <div
                  style={{
                    top: 10,
                    right: 10,
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => setShow(false)}
                >
                  x
                </div>

                <Image
                  src={selectedPlace.mainPhoto}
                  height={200}
                  width="100%"
                  radius="md"
                  style={{ objectFit: 'cover' }}
                />

                <Paper
                  style={{
                    gap: '1rem',
                    padding: '1rem',
                    marginTop: '1rem',
                    width: '100%',
                    minHeight: '200px',
                  }}
                  shadow="sm"
                  radius="lg"
                >
                  <h3>{selectedPlace?.name}</h3>
                  {selectedPlace?.description && <p>{selectedPlace?.description}</p>}
                  <p>Связаться</p>
                  <h3>{selectedPlace?.phone}</h3>
                  <p>Адрес</p>
                  <h3>{selectedPlace?.address}</h3>
                  <p>Часы работы</p>
                  <h3>{selectedPlace?.workingHours}</h3>
                </Paper>
              </>
            )}
          </div>
        )}
      </Transition>
    </div>
  );
};

export default MapPlace;
