import { Autocomplete, Button, Checkbox, Select, TextInput, Loader } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { PlaceResponse } from '../../../redux/api/type';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Group, Text, Image, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { showErrorNotification, showSuccessNotification } from './constans';
import { useCreateNotPlaceMutation } from '../../../redux/api/places';

const AddInputs = ({
  selectedPlace,
  categoryId,
  onClose,
}: {
  categoryId: number;
  selectedPlace: PlaceResponse | null;
  onClose: () => void;
}) => {
  const [addPlaceForModern, { isError, isSuccess }] = useCreateNotPlaceMutation();
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [maxBooking, setMaxBooking] = useState('');
  const [placeType, setPlaceType] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [phone, setPhone] = useState('');
  const [klickAdd, setKlickAdd] = useState(false);
  const [addressQuery, setAddressQuery] = useState('');
  const [debouncedAddress] = useDebouncedValue(addressQuery, 500);
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return <Image key={index} src={imageUrl} />;
  });
  const handleInputsNotPlace = () => {
    setKlickAdd(!klickAdd);
  };

  const addPlace = async () => {
    try {
      if (!placeType) {
        showErrorNotification('Выберите тип заведения!');
        return; // Останавливаем отправку
      }

      // Проверяем другие обязательные поля (если нужно)
      if (!name || !description || !phone || !address) {
        showErrorNotification('Заполните все обязательные поля!');
        return;
      }
      const formData = new FormData();

      // Добавляем текстовые данные
      formData.append('name', name);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('address', address);
      formData.append('description', description);
      formData.append('workingHours', workingHours);
      formData.append('maxBooking', maxBooking);
      formData.append('phone', phone);
      formData.append('categoryId', categoryId.toString());
      formData.append('placeType', placeType);
      formData.append('isBooking', isBooking.toString());

      // Добавляем файлы
      files.forEach((file, index) => {
        formData.append('photos', file);
      });

      addPlaceForModern(formData);
      onClose();
      showSuccessNotification();
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.data?.message || 'Неизвестная ошибка';
      showErrorNotification(errorMessage);
    }
  };

  const [addressSuggestions, setAddressSuggestions] = useState<
    Array<{ display_name: string; lat: string; lon: string }>
  >([]);

  const fetchAddressSuggestions = async (query: string) => {
    console.log('query', query);

    if (query.length < 3) {
      setAddressSuggestions([]);
      setIsFetching(false);
      return;
    }

    try {
      setIsFetching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=псков+${encodeURIComponent(query)}&format=jsonv2&addressdetails=1&limit=5`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (your@email.com)',
          },
        },
      );
      const data = await response.json();
      setAddressSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка при поиске адресов:', error);
      setAddressSuggestions([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAddressSuggestions(debouncedAddress);
  }, [debouncedAddress]);
  // 3. Преобразуем данные для Autocomplete
  const autocompleteData = addressSuggestions
    .filter(
      (item, index, self) => index === self.findIndex((t) => t.display_name === item.display_name),
    )
    .map((item) => ({
      value: item.display_name,
      label: item.display_name,
    }));

  return (
    <div>
      {!selectedPlace && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleInputsNotPlace} style={{ margin: '10px' }} className="btnAdd">
            добавить место
          </Button>
        </div>
      )}

      {klickAdd && (
        <>
          <Select
            style={{ zIndex: '999', width: '200px', marginTop: '10px' }}
            label="Выберите тип заведения"
            placeholder="Выберите тип заведения"
            required
            data={['фаст-фуд', 'кафе', 'ресторан', 'развлечения', 'кино']}
            onChange={(value) => setPlaceType(String(value))}
            searchable
          />
          <TextInput
            style={{ width: 'auto', marginTop: '10px' }}
            value={name}
            label="название"
            required
            onChange={(e) => setName(e.target.value)}
            placeholder={'название'}
            size="xs"
            radius="lg"
            mb={'10px'}
          />
          <TextInput
            style={{ width: 'auto', marginTop: '10px' }}
            value={description}
            label="описание"
            required
            onChange={(e) => setDescription(e.target.value)}
            placeholder={'описание'}
            size="xs"
            radius="lg"
            mb={'10px'}
          />
          <TextInput
            style={{ width: 'auto', marginTop: '10px' }}
            value={phone}
            label="Связаться"
            required
            onChange={(e) => setPhone(e.target.value)}
            placeholder={'Связаться'}
            size="xs"
            radius="lg"
            mb={'10px'}
          />

          <Autocomplete
            label="Адрес"
            placeholder="Введите адрес в Пскове"
            required
            value={address}
            onChange={(value) => {
              setAddress(value);
              setAddressQuery(value);
              setIsFetching(true);
            }}
            onOptionSubmit={(value) => {
              const selected = addressSuggestions.find((item) => item.display_name === value);
              if (selected) {
                setLatitude(selected.lat);
                setLongitude(selected.lon);
                setAddress(selected.display_name);
              }
            }}
            data={autocompleteData}
            rightSection={isFetching ? <Loader size="1rem" /> : null}
            style={{ width: '100%', marginTop: '10px' }}
          />
          <h6 style={{ color: 'red', margin: '0px' }}>
            {isFetching
              ? 'Поиск...'
              : !autocompleteData.length && !address
                ? 'Адрес не найден'
                : ''}
          </h6>
          <TextInput
            style={{ width: 'auto', marginTop: '10px' }}
            value={workingHours}
            label="часы работы"
            onChange={(e) => setWorkingHours(e.target.value)}
            placeholder={'часы работы'}
            size="xs"
            radius="lg"
            mb={'10px'}
          />

          <Dropzone
            accept={IMAGE_MIME_TYPE}
            onDrop={(newFiles) => setFiles([...files, ...newFiles])}
            maxSize={5 * 1024 ** 2}
            mb="md"
          >
            <Group justify="center" gap="xl" style={{ minHeight: rem(100) }}>
              <Dropzone.Accept>
                <IconUpload size="3.2rem" stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size="3.2rem" stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto size="3.2rem" stroke={1.5} />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Перетащите изображения сюда или кликните для выбора
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Загружайте до 5 файлов (макс. 5MB каждый)
                </Text>
              </div>
            </Group>
          </Dropzone>
          {previews.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', width: '50px' }}>
              {previews}
            </div>
          )}
          {isBooking ? (
            <TextInput
              style={{ width: 'auto', marginTop: '10px' }}
              value={maxBooking}
              label="укажите максимальное количество брониирований"
              onChange={(e) => setMaxBooking(e.target.value)}
              placeholder={'booking'}
              size="xs"
              radius="lg"
              mb={'10px'}
            />
          ) : (
            <></>
          )}

          <Button onClick={() => addPlace()} className="btnAdd">
            ok
          </Button>
        </>
      )}
    </div>
  );
};

export default AddInputs;
