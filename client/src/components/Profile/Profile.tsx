import React, { useEffect, useState } from 'react';
import { useGetUserQuery, usePutUserMutation } from '../../redux/api/main-sevices';
import { useNavigate } from 'react-router';
import {
  Button,
  Container,
  Paper,
  Text,
  Avatar,
  Divider,
  Select,
  TextInput,
  LoadingOverlay,
} from '@mantine/core';
import { useGetUserLikesQuery } from '../../redux/api/places';

const Profile = () => {
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useGetUserQuery({});
  const { data: userLike, isLoading: isLoadingLike } = useGetUserLikesQuery();
  const [isClick, setIsClick] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [updateUser, { isLoading: isLoadingUser }] = usePutUserMutation();
  const handleShowInputs = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsClick(!isClick);
  };
  const handleClickEdite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    updateUser({ name, email, phone }).unwrap();
    setIsClick(false);
  };
  const handleLoginRedirect = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigate('/login');
  };

  // Заглушка для данных бронирований (замените на реальные данные)
  const bookings = [
    { id: 1, date: '2023-10-15', service: 'Стрижка' },
    { id: 2, date: '2023-11-20', service: 'Маникюр' },
  ];

  // Инициализируем состояния данными пользователя
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  return (
    <>
      <LoadingOverlay visible={isLoadingUser || isLoading || isLoadingLike} />
      <Paper
        style={{
          display: 'flex',
          gap: '2rem',
          padding: '2rem',
          margin: '20px auto 20px',
          width: '100%',
          maxWidth: '800px',
          minHeight: '60vh',
        }}
        shadow="sm"
        radius="lg"
      >
        <div style={{ flex: 1, color: '#4169E1' }}>
          <Container>
            <Avatar m={'20px'} component="a" target="_blank" src="avatar.png" size={'xl'} />

            <Container>
              {isClick ? (
                <>
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
                    style={{ width: '100%' }}
                    label="Почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="редактируйте почту"
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
                  />
                </>
              ) : (
                <>
                  <Text
                    size="xl"
                    fw={900}
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 0 }}
                  >
                    {user?.name}
                  </Text>
                  <Text c="dimmed">{user?.role}</Text>
                  <Text c="dimmed">{user?.phone}</Text>
                  <Text c="dimmed">{user?.email}</Text>
                </>
              )}
            </Container>
            {!isClick ? (
              <Button
                onClick={handleShowInputs}
                style={{ margin: '5px', marginLeft: '10px', background: '#4169E1', color: 'white' }}
              >
                Редактировать
              </Button>
            ) : (
              <Container style={{ marginLeft: '10px', marginTop: '20px', paddingInline: '2px' }}>
                <Button
                  onClick={handleClickEdite}
                  style={{ margin: '2px', background: '#4169E1', color: 'white' }}
                >
                  Сохранить
                </Button>
                <Button
                  onClick={handleShowInputs}
                  style={{ background: '#4169E1', color: 'white' }}
                >
                  Отмена
                </Button>
              </Container>
            )}
          </Container>
        </div>
        <Divider size="xs" orientation="vertical" />

        <div style={{ flex: 2 }}>
          <Select
            label="Ваши избранные"
            placeholder="Выберите"
            data={
              userLike?.map((like) => ({
                value: like.place.id.toString(),
                label: like.place.name,
              })) || []
            }
            searchable
          />
        </div>
      </Paper>
    </>
  );
};

export default Profile;
