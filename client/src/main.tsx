import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { store } from './redux/store';
import App from './App/App';
import { MantineProvider, Overlay } from '@mantine/core';
import '@mantine/core';
import '@mantine/core/styles.css';
import { Global } from '@emotion/react';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

//#4169E1
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <MantineProvider
    theme={{
      fontFamily: 'Roboto, sans-serif',
      headings: { fontFamily: 'Roboto, sans-serif' },
      components: {
        Button: {
          styles: {
            root: {
              background: 'rgba(255, 255, 255, 0.172)',
              backdropFilter: 'blur(1px)',
              borderRadius: '70px',
              margin: '20px auto',
              '&:hover': {
                color: 'var(--mantine-color-blue-6)',
              },
            },
          },
        },
      },
    }}
  >
    <Global
      styles={() => ({
        html: {
          height: '100%',
        },
        body: {
          backgroundColor: '#003153', // Ваш цвет фона

          minHeight: '100vh',
          height: '100%',

          margin: 0,
          padding: 0,
          overflowX: 'hidden',

          backgroundImage: `
        radial-gradient(circle at 15px 15px, rgba(255, 255, 255, 0.78) 1px, transparent 0)
      `,
          backgroundSize: '50px 50px',
        },
        '#root': {
          height: '100%',
          minHeight: '100vh',
        },
      })}
    />

    <Notifications position="top-left" autoClose={3000} zIndex={1000} />
    <Provider store={store}>
      <App />
    </Provider>
  </MantineProvider>,
);
