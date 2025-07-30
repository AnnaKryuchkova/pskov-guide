import React, { useEffect } from 'react';
import {
  useApproveNotPlaceMutation,
  useGetNotPlacesForModerationQuery,
  useRejectNotPlaceMutation,
} from '../../redux/api/places';
import {
  Alert,
  Button,
  CloseButton,
  Image,
  Loader,
  LoadingOverlay,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { CustomContainer } from '../../shared/custom-conteiner';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconXboxX } from '@tabler/icons-react';
import { showErrorNotification, showSuccessNotification } from '../Categories/ui/constans';

const Moderation = () => {
  const {
    data: allPlaseForModer = [],
    isLoading,
    error,
    refetch,
  } = useGetNotPlacesForModerationQuery();

  useEffect(() => {
    if (error) {
      console.error('Moderation fetch error:', error);
      notifications.show({
        title: 'Ошибка',
        message: error.data?.error || 'Ошибка загрузки данных',
        color: 'red',
      });
    }
  }, [error]);

  const [addPlace, { isLoading: isLoadingPlace }] = useApproveNotPlaceMutation();
  const [delPlace, { isLoading: isLoadingDelPlace }] = useRejectNotPlaceMutation();

  const handleUpprove = async (id) => {
    try {
      await addPlace(id).unwrap();
      // const updatedList = allPlaseForModer.filter((place) => place.id !== id);
      showSuccessNotification();
      await refetch();
    } catch (error) {
      console.error('Approval error:', error);
      showErrorNotification(error.data?.message || 'Ошибка при добавлении места');
    }
  };
  const handleDel = async (id) => {
    try {
      const response = await delPlace(id).unwrap();
      showSuccessNotification();
      await refetch();
    } catch (error) {
      console.error('Delete error:', error);
      let errorMessage = 'Ошибка при удалении места';

      // Обработка 404 ошибки
      if (error.originalStatus === 404) {
        errorMessage = 'Место не найдено (уже удалено?)';
        await refetch(); // Обновляем список если место не найдено
      }

      showErrorNotification(errorMessage);
    }
  };
  if (isLoading) {
    return <Loader size="xl" variant="dots" />;
  }
  if (error) {
    return (
      <Alert title="Ошибка" color="red" icon={<IconAlertCircle />}>
        <Text mb="md">{error.data?.error || 'Не удалось загрузить данные'}</Text>
        <Button onClick={refetch}>Попробовать снова</Button>
      </Alert>
    );
  }
  return (
    <>
      <LoadingOverlay visible={isLoading || isLoadingPlace || isLoadingDelPlace} />
      <div>
        {allPlaseForModer.length === 0 ? (
          <Text fz={{ base: 'lg', sm: '22px' }} c={'#ffffff'} fw={600} ta="center">
            Нет черновиков
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
            {allPlaseForModer?.map((notPlace) => (
              <div key={notPlace.id} style={{ position: 'relative' }}>
                <CustomContainer
                  data={{
                    name: notPlace?.name,
                    img: notPlace?.photos?.find((photo) => photo.isMain)?.url || '',
                    workingHours: notPlace.workingHours,
                    address: notPlace.address,
                    description: notPlace.description, // Добавлено
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
                    onClick={() => handleUpprove(notPlace.id)}
                    size="sm"
                    variant="light"
                    color="green"
                  >
                    Одобрить
                  </Button>

                  <Button
                    onClick={() => handleDel(notPlace.id)}
                    size="sm"
                    variant="light"
                    color="red"
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </SimpleGrid>
        )}
      </div>
    </>
  );
};

export default Moderation;
