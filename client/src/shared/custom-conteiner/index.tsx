import React from 'react';
import './main.css';
import { BackgroundImage, Stack, Text } from '@mantine/core';

export const CustomContainer = ({
  data,
}: {
  data: { img: string; name: string; workingHours: string; address: string };
}) => {
  return (
    <BackgroundImage
      className="main-container-cards"
      key={data.name}
      src={data.img}
      radius="xl"
      w={300}
      h={300}
      style={{
        position: 'relative', // Важно для позиционирования оверлея
        justifyItems: 'start',
        alignItems: 'end',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)', // Чёрный с 50% прозрачностью
          display: 'flex',

          alignItems: 'end', // Выравнивание текста внизу
          borderRadius: 'var(--mantine-radius-md)', // Совпадает с radius="md"
        }}
      >
        <Stack gap="xm" align="left" my="xl" style={{ marginLeft: '24px' }}>
          <Text fz={{ base: 'sm', sm: '22px' }} className="card-text" c="#fff" fw={700}>
            {data.name}
          </Text>
          <Text fz={{ base: 'sm', sm: '16px' }} className="card-text" c="#fff" fw={700}>
            {data.description}
          </Text>
        </Stack>
      </div>
    </BackgroundImage>
  );
};
