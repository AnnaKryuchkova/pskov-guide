import React, { useState } from 'react';
import './main.css';
import {
  Box,
  Button,
  Container,
  Popover,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { entertainmentPlaces } from './constans';
import { CustomContainer } from '../../shared/custom-conteiner';
import { Icon12Hours } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { useMediaQuery } from '@mui/material';

function Main() {
  const nav = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryClick = (str: string) => {
    setSelectedCategory(str);
  };

  const handleNav = () => nav('/categories');

  return (
    <Box>
      <Stack align="center" justify="center" gap="sm" className="text-block">
        <Text className="cutout-text" c={'#ffffff'} fz={{ base: 'lg', sm: '40px' }} fw={600}>
          Путеводитель
        </Text>
      </Stack>
      <Container className="main-container" maw={800} h={200}>
        <Stack c={'#ffffff'} align="center" justify="center" gap="sm" className="text-block">
          <Text className="cutout-text" fz={{ base: 'sm', sm: '22px' }} fw={600} ta="center">
            Вы наконец нашли нужный сайт!
          </Text>
          <Text className="cutout-text" fz={{ base: 'lg', sm: '28px' }} fw={600} ta="center">
            Ведь тут мы собрали для вас актуальные места Пскова
          </Text>
          <Text className="cutout-text" fz={{ base: 'lg', sm: '22px' }} fw={600} ta="center">
            Теперь вы сможете насладиться городом на 100%
          </Text>
        </Stack>
      </Container>
      <Popover width={100} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <Container maw={1200} className="container-cards" px="md">
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 2 }}
              spacing="xl"
              style={{
                width: '100%',
                justifyContent: 'center', // Добавляем центрирование
              }}
            >
              {entertainmentPlaces.map((el) => (
                <Box
                  key={el.id}
                  onClick={() => handleCategoryClick(el.modal)}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Popover
                    position={
                      !isMobile
                        ? ['где вкусно', 'будет точно весело'].includes(el.name)
                          ? 'left'
                          : 'right'
                        : undefined
                    }
                    withArrow
                    shadow="md"
                  >
                    <Popover.Target>
                      <Box
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <CustomContainer
                          data={{ name: el.name, description: el.description, img: el.image }}
                        />
                      </Box>
                    </Popover.Target>

                    <Popover.Dropdown>
                      <Text w="250" size="xl">
                        {selectedCategory}
                      </Text>
                      <Button onClick={handleNav} className="buttonNav">
                        перейти
                      </Button>
                    </Popover.Dropdown>
                  </Popover>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Popover.Target>
      </Popover>
    </Box>
  );
}

export default Main;
