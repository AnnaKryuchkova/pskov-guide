import React, { useState, useEffect } from 'react';
import {
  Button,
  Image,
  LoadingOverlay,
  Paper,
  Popover,
  Select,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Carousel } from '@mantine/carousel';
import '../category.css';
import { useGetUserQuery } from '../../../redux/api/main-sevices';
import { PlaceResponse } from '../../../redux/api/type';
import { useNavigate } from 'react-router';
import { createImageMarker, MapContent } from './constans';
import { useMediaQuery } from '@mantine/hooks';
import AddInputs from './AddInputs';
import EditPlace from './EditPlace';
import {
  useAddLikeMutation,
  useCheckLikeQuery,
  useRemoveLikeMutation,
} from '../../../redux/api/places';

const ModalPlaces = ({
  categoryId,
  selectedPlace,
  setSelectedPlace,
  places,
  handleDeletePlace,
  refetchPlaces,
  handleClose,
}: {
  categoryId: number | null;
  places: PlaceResponse[] | undefined;
  setSelectedPlace: React.Dispatch<React.SetStateAction<PlaceResponse | null>>;
  handleAddPlace: (obj: { name: string; desc: string; maxBook: number }) => void;
  handleDeletePlace: (id: string | number) => void;
  selectedPlace: PlaceResponse | null;
  refetchPlaces: () => void;
  handleClose: () => void;
}) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [showPlaceDetails, setShowPlaceDetails] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [filtredPlaces, setFiltredPlaces] = useState<PlaceResponse[] | []>([]); // массив отфильтрованных мест
  const [filtredTypeName, setFiltredTypeName] = useState<string | null>(''); //выбранное значение
  const [addLike, { isLoading: isAddingLike }] = useAddLikeMutation();
  const [removeLike, { isLoading: isRemovingLikeLoading }] = useRemoveLikeMutation();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useGetUserQuery({});
  const {
    data: isLiked,
    refetch: refetchLike,
    isLoading: isLoadCheckLike,
  } = useCheckLikeQuery(selectedPlace?.id || 0, {
    skip: !selectedPlace?.id || !user?.id,
  });

  const handleLike = async () => {
    if (!selectedPlace || !user?.id) return;

    try {
      if (isLiked?.isLiked) {
        await removeLike(selectedPlace.id).unwrap();
      } else {
        await addLike({ placeId: selectedPlace.id }).unwrap();
      }
      refetchLike(); // Обновляем статус лайка
    } catch (error) {
      console.error('Error handling like:', error);
      // Можно добавить уведомление об ошибке
    }
  };

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
  };

  useEffect(() => {
    if (selectedPlace) {
      setShowPlaceDetails(true);
    } else {
      setShowPlaceDetails(false);
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (filtredTypeName && places.length) {
      //выбрали тип => фильтруй
      setFiltredPlaces(places?.filter((el) => el?.placeType == filtredTypeName));
    } else if (!filtredTypeName) {
      // если не выбрали тип -> сохрани все места
      setFiltredPlaces(places);
    }
  }, [filtredTypeName, places]);

  useEffect(() => {
    refetchPlaces();
  }, []);

  return (
    <>
      <LoadingOverlay
        visible={isAddingLike || isLoading || isRemovingLikeLoading || isLoadCheckLike}
      />
      <Select
        style={{ zIndex: '999', width: '200px', marginTop: '10px' }}
        label="Выберите категорию"
        description="куда хотите сходить?"
        placeholder="Выберите"
        data={[...new Set(places?.map((el) => el?.placeType))]}
        onChange={(value) => setFiltredTypeName(value)}
        searchable
      />
      <AddInputs
        onClose={handleClose}
        selectedPlace={selectedPlace}
        categoryId={Number(categoryId)}
        places={places}
      />
      <div
        style={{
          flex: 1,
          height: selectedPlace ? (isMobile ? '40%' : '400px') : isMobile ? '100%' : '100vh',
          transition: isMobile ? 'height 0.3s ease' : 'relative',
        }}
      >
        <MapContainer
          center={[57.8136, 28.3496]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapContent places={filtredPlaces} />

          {filtredPlaces?.map((place) => (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              icon={createImageMarker(place.Photos?.[0]?.fullUrl || 'fallback-image-url')}
              eventHandlers={{
                click: () => handleMarkerClick(place),
              }}
            ></Marker>
          ))}
        </MapContainer>
      </div>
      {selectedPlace && (
        <Transition
          mounted={showPlaceDetails}
          transition="slide-up"
          duration={300}
          timingFunction="ease"
        >
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
                zIndex: 800,
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
                    onClick={() => setSelectedPlace(null)}
                  >
                    x
                  </div>

                  <Carousel
                    slideSize="100%"
                    height={isMobile ? 200 : 400}
                    slideGap="md"
                    // align="start"
                    nextControlIcon={<IconArrowRight size={16} color="white" />}
                    previousControlIcon={<IconArrowLeft size={16} color="white" />}
                    // slidesToScroll={1}
                    withIndicators
                    styles={{
                      slide: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    }}
                  >
                    {selectedPlace.Photos.map((el) => (
                      <Carousel.Slide key={el.id}>
                        <Image
                          src={el.fullUrl}
                          height={isMobile ? 200 : 400}
                          width="100%"
                          radius="md"
                          style={{ objectFit: 'cover' }}
                        />
                      </Carousel.Slide>
                    ))}
                  </Carousel>
                  {user?.name ? (
                    <Button onClick={handleLike} className="btnLike">
                      {isLiked?.isLiked ? '❤️' : '🤍'}
                    </Button>
                  ) : (
                    <Popover width={400} position="bottom" withArrow shadow="md">
                      <Popover.Target>
                        <Button onClick={handleLike} className="btnLike">
                          🤍
                        </Button>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <p style={{ height: '14px', width: 'auto' }}>
                          <a
                            href="/login"
                            style={{
                              color: '#228be6',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                            onClick={(e) => {
                              e.preventDefault();

                              navigate('/login');
                            }}
                          >
                            войдите
                          </a>
                          , чтобы добавить в избранное
                        </p>
                      </Popover.Dropdown>
                    </Popover>
                  )}

                  <Paper
                    style={{
                      gap: isMobile ? '1rem' : '2rem',
                      padding: isMobile ? '1rem' : '2rem',
                      marginTop: isMobile ? '1rem' : undefined,
                      margin: isMobile ? undefined : '20px auto 20px',

                      width: '100%',
                      maxWidth: isMobile ? undefined : '400px',
                      minHeight: isMobile ? '200px' : '400px',
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
                    <Button>like</Button>
                    {user?.role === 'admin' ? (
                      <div style={{ display: 'flex' }}>
                        <Button onClick={() => setIsUpdate(true)} className="btnAdd">
                          Редактирвать место
                        </Button>
                        <Button
                          style={{ backgroundColor: 'red' }}
                          onClick={() => handleDeletePlace(selectedPlace.id)}
                          className="btnAdd"
                        >
                          удалить место
                        </Button>
                      </div>
                    ) : (
                      <></>
                    )}

                    {isUpdate && (
                      <EditPlace
                        selectedPlace={selectedPlace}
                        categoryId={categoryId}
                        setIsUp={setIsUpdate}
                        refetchPlaces={refetchPlaces}
                        placeCard={() => setSelectedPlace(null)}
                      />
                    )}
                  </Paper>
                </>
              )}
            </div>
          )}
        </Transition>
      )}{' '}
    </>
  );
};

export default ModalPlaces;
