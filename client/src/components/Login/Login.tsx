import { Button, PasswordInput, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import { useGetUserQuery, useLoginMutation } from '../../redux/api/main-sevices';
import { useNavigate } from 'react-router';

const Login = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const { refetch } = useGetUserQuery({});

  const [value, setValue] = useState({
    email: '',
    password: '',
  });
  //   const user = useGetUserQuery();
  const handleLogin = () => {
    login({
      email: value.email,
      password: value.password,
    }).then((data) => {
      if (!data.error) {
        navigate('/');
        setValue({
          email: '',
          password: '',
        });
        refetch();
      }
    });
  };

  return (
    <div className="inputs">
      <TextInput
        w={200}
        withAsterisk
        label="Your email"
        placeholder="Your email"
        value={value.email}
        onChange={(event) => setValue((prev) => ({ ...prev, email: event.target.value }))}
      />
      <PasswordInput
        w={200}
        withAsterisk
        label="Your password"
        placeholder="Your password"
        value={value.password}
        onChange={(event) => setValue((prev) => ({ ...prev, password: event.target.value }))}
      />
      <Button onClick={handleLogin}>Войти</Button>
      <Button style={{ margin: '10px' }} onClick={() => navigate('/reg')}>
        Регистарция
      </Button>
    </div>
  );
};

export default Login;
