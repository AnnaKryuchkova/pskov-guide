import React, { useEffect, useState } from 'react';
import {
  Burger,
  Container,
  Group,
  Drawer,
  Stack,
  Button,
  LoadingOverlay,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Logo from '../../components/Header/img/Logo.svg';
import './header.css';
import { useLocation, useNavigate } from 'react-router';
import { useGetUserQuery, useLogoutMutation } from '../../redux/api/main-sevices';
import { allLinks, loginTooltipText } from './constans';

export const Header = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const nav = useNavigate();
  const { data: user, isLoading, refetch } = useGetUserQuery({});
  const [logout, { isLoading: isLoadingLogout }] = useLogoutMutation();

  const isAuth = user ? true : false;

  const handleLogout = async () => {
    logout().then((data) => {
      nav('/');
      refetch();
    });
  };

  const handleClick = () => {
    nav('/login');
  };

  const items = allLinks(isAuth)?.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className="link"
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        nav(link.link);
        close();
      }}
    >
      {link.label}
    </a>
  ));

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <LoadingOverlay visible={isLoading || isLoadingLogout} />
      <header className="header">
        <Container size="md" className="inner">
          <img src={Logo} className="logo" alt="Логотип" />

          <Group gap={5} visibleFrom="xs">
            {items}
          </Group>
          {isAuth ? (
            <Button style={{ margin: '10px' }} onClick={handleLogout}>
              {'Выйти'}
            </Button>
          ) : (
            <Tooltip
              label={loginTooltipText}
              position="bottom"
              withArrow
              transitionProps={{ transition: 'pop', duration: 300 }}
              multiline
              w={320}
            >
              <Button style={{ margin: '10px' }} onClick={handleClick}>
                {'Войти'}
              </Button>
            </Tooltip>
          )}

          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="xs"
            size="sm"
            aria-label="Открыть меню"
          />

          <Drawer
            opened={opened}
            onClose={close}
            size="50%"
            position="left"
            hiddenFrom="xs"
            zIndex={900}
            styles={{
              body: {
                height: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
          >
            <Stack gap="xl" align="center">
              {allLinks(isAuth).map((link) => (
                <a
                  key={link.label}
                  href={link.link}
                  style={{
                    fontSize: '14px',
                    textDecoration: 'none',
                    color: active === link.link ? 'var(--mantine-color-blue-6)' : 'inherit',
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    setActive(link.link);
                    nav(link.link);
                    close();
                  }}
                >
                  {link.label}
                </a>
              ))}
            </Stack>
          </Drawer>
        </Container>
      </header>
    </>
  );
};
