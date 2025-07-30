import React, { useEffect, useState } from 'react';
import { UserLike } from '../../redux/api/type';
import {
  Button,
  Drawer,
  LoadingOverlay,
  Modal,
  SimpleGrid,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { CustomContainer } from '../../shared/custom-conteiner';
import { useMediaQuery } from '@mantine/hooks';
import MapPlace from './ui/MapPlace';
import { useGetUserLikesQuery, useRemoveLikeMutation } from '../../redux/api/places';
import { showErrorNotification, showSuccessNotification } from '../Categories/ui/constans';

const Likes = () => {
  const { data: userLike = [], refetch, isLoading } = useGetUserLikesQuery();
  const [selectedPlace, setSelectedPlace] = useState<UserLike['place'] | null>(null);
  const [opened, setOpened] = useState(false);
  const [delPlace, { isLoading: isLoadingDelPlace }] = useRemoveLikeMutation();
  const theme = useMantineTheme();

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const handlePlaceClick = (place: UserLike['place']) => {
    setSelectedPlace({
      ...place,
      latitude: place.latitude || 57.8136, // Псков по умолчанию
      longitude: place.longitude || 28.3496,
    });
    setOpened(true);
  };
  const handleDel = (e: Event, id) => {
    e.stopPropagation();
    try {
      delPlace(id);
      showSuccessNotification();
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      let errorMessage = 'Ошибка при удалении места';

      // Обработка 404 ошибки
      if (error.status === 404) {
        errorMessage = 'Место не найдено (уже удалено?)';
        refetch(); // Обновляем список если место не найдено
      }

      showErrorNotification(errorMessage);
    }
  };
  const handleClose = () => {
    setOpened(false);
    setSelectedPlace(null);
  };

  return (
    <>
      <LoadingOverlay visible={isLoading || isLoadingDelPlace} />
      <div>
        {userLike.length === 0 ? (
          <Text fz={{ base: 'lg', sm: '22px' }} c={'#ffffff'} fw={600} ta="center">
            Нет избранных мест
          </Text>
        ) : (
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 2 }}
            spacing="xl"
            verticalSpacing="xl"
            style={{
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto',
              padding: '20px',
            }}
          >
            {userLike?.map((likes) => (
              <div
                key={likes.id}
                onClick={() => handlePlaceClick(likes.place)}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <CustomContainer
                  data={{
                    name: likes?.place.name || '',
                    img: likes?.place.mainPhoto || '',
                    workingHours: likes?.place.workingHours || '',
                    address: likes?.place.address,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    display: 'flex',
                    gap: 8,
                    zIndex: 1, // Чтобы кнопки были выше карточки
                  }}
                >
                  <Button
                    onClick={(e) => handleDel(e, likes.place.id)}
                    size="sm"
                    variant="light"
                    color="red"
                  >
                    удалить
                  </Button>
                </div>
              </div>
            ))}
          </SimpleGrid>
        )}
        {isMobile ? (
          <div style={{ position: 'relative' }}>
            {' '}
            <Drawer
              opened={opened}
              onClose={handleClose}
              title={selectedPlace?.name}
              position="bottom"
              size="90%"
              styles={{
                content: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
                body: {
                  height: 'calc(100% - 60px)',
                  padding: 0,
                },
              }}
            >
              {' '}
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  display: 'flex',
                  gap: 8,
                  zIndex: 1, // Чтобы кнопки были выше карточки
                }}
              ></div>
              {selectedPlace && <MapPlace selectedPlace={selectedPlace} userLike={userLike} />}
            </Drawer>
          </div>
        ) : (
          <Modal
            opened={opened}
            onClose={handleClose}
            title={selectedPlace?.name}
            size="xl"
            styles={{
              content: { height: '700px' },
            }}
          >
            {selectedPlace && <MapPlace selectedPlace={selectedPlace} userLike={userLike} />}
          </Modal>
        )}
      </div>
    </>
  );
};

export default Likes;
