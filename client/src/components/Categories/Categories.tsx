import React, { useState, useEffect } from 'react';
import { useGetCategoriesQuery } from '../../redux/api/main-sevices';
import { LoadingOverlay, Modal, Drawer, useMantineTheme, SimpleGrid, Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { CustomContainer } from '../../shared/custom-conteiner';
import { PlaceResponse } from '../../redux/api/type';
import './category.css';
import ModalPlaces from './ui/ModalPlaces';
import { useDeletePlaceMutation, useGetPlacesQuery } from '../../redux/api/places';

const Categories = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [opened, setOpened] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResponse | null>(null);

  const { data: categories, isLoading, error } = useGetCategoriesQuery({});
  const {
    data: places,
    isLoading: placesLoading,
    refetch: refetchPlaces,
  } = useGetPlacesQuery(selectedCategoryId, {
    skip: !selectedCategoryId,
  });
  const [deletePlace] = useDeletePlaceMutation();
  // const [addPlace] = useAddPlaceMutation();

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
    setSelectedPlace(null);
  };

  const handleDeletePlace = (id: number | string) => {
    console.log('id', id);

    deletePlace(id);
    refetchPlaces();
    setSelectedPlace(null);
  };
  const handleAddPlace = (obj: { name: string; desc: string; maxBook: number }) => {
    // addPlace(obj)
  };

  if (error) return <div>Error loading categories</div>;

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading || placesLoading} />

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 2 }} // 4 колонки на десктопах
        spacing="xl"
        verticalSpacing="xl"
        style={{
          width: '100%',
          maxWidth: '800px', // Ограничиваем максимальную ширину сетки
          margin: '0 auto', // Центрируем сетку
          padding: '45px',
          justifyItems: 'center',
        }}
      >
        {categories?.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            style={{
              display: 'flex',
              justifyContent: 'center', // Добавляем центрирование
            }}
          >
            <CustomContainer
              data={{
                description: category?.description || '',

                name: category?.name || '',
                img: category?.icon || '',
              }}
            />
          </div>
        ))}
      </SimpleGrid>

      {isMobile ? (
        <Drawer
          opened={opened}
          onClose={handleClose}
          title={categories?.find((c) => c.id === selectedCategoryId)?.name || 'Places'}
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
          <ModalPlaces
            handleClose={handleClose}
            refetchPlaces={refetchPlaces}
            categoryId={selectedCategoryId}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            places={places}
            handleDeletePlace={handleDeletePlace}
            handleAddPlace={handleAddPlace}
          />
        </Drawer>
      ) : (
        <Modal
          opened={opened}
          onClose={handleClose}
          title={categories?.find((c) => c.id === selectedCategoryId)?.name || 'Places'}
          size="xl"
          styles={{
            content: { height: '700px' },
          }}
        >
          <ModalPlaces
            handleClose={handleClose}
            refetchPlaces={refetchPlaces}
            categoryId={selectedCategoryId}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            places={places}
            handleDeletePlace={handleDeletePlace}
            handleAddPlace={handleAddPlace}
          />
        </Modal>
      )}
    </div>
  );
};

export default Categories;
