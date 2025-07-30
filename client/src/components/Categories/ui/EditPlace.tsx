import { Button, Checkbox, LoadingOverlay, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { PlaceResponse } from '../../../redux/api/type';
import { useEditePlaceMutation } from '../../../redux/api/places';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Group, Text } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';

const EditPlace = ({
  selectedPlace,
  categoryId,
  setIsUp,
  refetchPlaces,
  placeCard,
}: {
  categoryId: number;
  setIsUp: (el: boolean) => void;
  selectedPlace: PlaceResponse | null;
  refetchPlaces: () => void;
  placeCard: () => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);
  const [editPlace, { isLoading: isLoadingEdit }] = useEditePlaceMutation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [maxBooking, setMaxBooking] = useState('');

  const handleDeletePhoto = (photoId: string) => {
    setPhotosToDelete((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId],
    );
  };

  const handleInputsPlace = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('workingHours', workingHours);
    formData.append('maxBooking', maxBooking);
    formData.append('phone', phone);
    formData.append('isBooking', isBooking.toString());
    formData.append('deletePhotos', JSON.stringify(photosToDelete));

    files.forEach((file) => {
      formData.append('photos', file);
    });

    try {
      await editPlace({ id: selectedPlace?.id || '', body: formData }).unwrap();
      refetchPlaces();
      placeCard();
      setIsUp(false);
    } catch (error) {
      console.error('Error updating place:', error);
    }
  };

  useEffect(() => {
    if (selectedPlace) {
      setName(selectedPlace.name);
      setDescription(selectedPlace.description || '');
      setLatitude(selectedPlace.latitude?.toString() || '');
      setLongitude(selectedPlace.longitude?.toString() || '');
      setAddress(selectedPlace.address || '');
      setPhone(selectedPlace.phone || '');
      setWorkingHours(selectedPlace.workingHours || '');
      setMaxBooking(selectedPlace.maxBooking?.toString() || '');
      setIsBooking(selectedPlace.isBooking || false);
    }
  }, [selectedPlace]);

  return (
    <>
      <LoadingOverlay visible={isLoadingEdit} />
      <div>
        <TextInput
          style={{ width: '100%' }}
          value={name}
          label="Имя"
          onChange={(e) => setName(e.target.value)}
          placeholder={'редактируйте имя'}
          size="xs"
          radius="lg"
          mb={'10px'}
        />
        <TextInput
          label="Телефон"
          style={{ width: '100%' }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="редактируйте телефон"
          size="xs"
          radius="lg"
          mb={'10px'}
        />{' '}
        <TextInput
          label="адрес"
          style={{ width: '100%' }}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="редактируйте адрес"
          size="xs"
          radius="lg"
          mb={'10px'}
        />
        <TextInput
          label="описание"
          style={{ width: '100%' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="редактируйте описание"
          size="xs"
          radius="lg"
          mb={'10px'}
        />
        <TextInput
          label="широта"
          style={{ width: '100%' }}
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="редактируйте широту"
          size="xs"
          radius="lg"
          mb={'10px'}
        />
        <TextInput
          label="долгота"
          style={{ width: '100%' }}
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="редактируйте долготу"
          size="xs"
          radius="lg"
          mb={'10px'}
        />
        <TextInput
          label="часы работы"
          style={{ width: '100%' }}
          value={workingHours}
          onChange={(e) => setWorkingHours(e.target.value)}
          placeholder="редактируйте часы работы"
          size="xs"
          radius="lg"
          mb={'10px'}
        />
        <TextInput
          label="бронирования"
          style={{ width: '100%' }}
          value={maxBooking}
          onChange={(e) => setMaxBooking(e.target.value)}
          placeholder="редактируйте бронирования"
          size="xs"
          radius="lg"
          mb={'10px'}
        />
        <div>
          <Text size="sm" mb="xs">
            Фотографии места
          </Text>

          {selectedPlace?.Photos?.map((photo) => (
            <div key={photo.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <img
                src={photo.fullUrl}
                alt={photo.originalName}
                style={{ width: 100, height: 100, objectFit: 'cover', marginRight: 10 }}
              />
              <Checkbox
                label="Удалить"
                checked={photosToDelete.includes(photo.id)}
                onChange={() => handleDeletePhoto(photo.id)}
              />
            </div>
          ))}
        </div>
        {/* Загрузка новых фото */}
        <Dropzone
          onDrop={(newFiles) => setFiles([...files, ...newFiles])}
          accept={IMAGE_MIME_TYPE}
          maxSize={5 * 1024 ** 2}
          mb="md"
        >
          <Group justify="center">
            <IconUpload size="3rem" />
            <Text>Перетащите новые фотографии</Text>
          </Group>
        </Dropzone>
        {/* Превью новых фото */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {files.map((file, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={URL.createObjectURL(file)}
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
              <Button
                size="xs"
                color="red"
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={() => setIsUp(false)} style={{ margin: '10px' }} className="btnAdd">
            Отмена
          </Button>
          <Button onClick={handleInputsPlace} style={{ margin: '10px' }} className="btnAdd">
            ок
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditPlace;
