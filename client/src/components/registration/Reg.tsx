import { Button, Checkbox, LoadingOverlay, PasswordInput, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import './reg.css';
import { useGetUserQuery, usePostRegistrationMutation } from '../../redux/api/main-sevices';
import { useNavigate } from 'react-router';
import { InputBase } from '@mantine/core';

const Registration = () => {
  const [value, setValue] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    phone: '+7',
    role: false,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const nav = useNavigate();
  const [postReg, { error, isLoading }] = usePostRegistrationMutation();
  const { refetch, isLoading: isLoadingUser } = useGetUserQuery({});

  const handleRegistration = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    try {
      const result = await postReg({
        name: value.name,
        email: value.email,
        password: value.password,
        age: value.age,
        phone: value.phone,
        role: value.role ? 'admin' : 'user',
      }).unwrap();

      nav('/');
      setValue({
        name: '',
        email: '',
        password: '',
        age: '',
        phone: '',
        role: false,
      });
      refetch();
    } catch (error: any) {
      if (error.status === 400) {
        // Обработка ошибок валидации
        if (error.data?.errors) {
          // Преобразуем ошибки полей в формат { fieldName: errorMessage }
          const errors = Object.entries(error.data.errors).reduce(
            (acc, [field, messages]) => {
              acc[field] = Array.isArray(messages) ? messages.join(', ') : String(messages);
              return acc;
            },
            {} as Record<string, string>,
          );

          setFieldErrors(errors);
        } else if (error.data?.error) {
          // Общая ошибка
          setFormError(error.data.message);
        } else {
          setFormError('Неверные данные для регистрации');
        }
      } else {
        setFormError('Произошла ошибка при регистрации');
        // console.error('Registration error:', error);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Если пытаются удалить +7, не даем это сделать
    if (input.length < 3) {
      setValue((prev) => ({ ...prev, phone: '+7 ' }));
      return;
    }

    // Проверяем, что ввод начинается с +7
    if (!input.startsWith('+7 ')) {
      // Если нет, восстанавливаем +7 и добавляем цифры
      const numbers = input.replace(/\D/g, '');
      if (numbers.startsWith('7')) {
        const rest = numbers.slice(1);
        setValue((prev) => ({ ...prev, phone: `+7 ${rest}` }));
      } else if (numbers.startsWith('8')) {
        // Конвертируем 8 в +7
        const rest = numbers.slice(1);
        setValue((prev) => ({ ...prev, phone: `+7 ${rest}` }));
      } else {
        // Просто добавляем цифры после +7
        const rest = numbers;
        setValue((prev) => ({ ...prev, phone: `+7 ${rest}` }));
      }
      return;
    }

    // Разрешаем ввод только цифр после +7
    const newValue = '+7 ' + input.substring(3).replace(/\D/g, '');
    setValue((prev) => ({ ...prev, phone: newValue }));
  };

  // если запрос приходит со статусом 400 отображать ошибку из ответа запроса .error

  return (
    <div className="inputs">
      <LoadingOverlay visible={isLoading || isLoadingUser} />
      <form onSubmit={handleRegistration}>
        {formError && <h3 style={{ color: 'white' }}>{formError}</h3>}
        <TextInput
          w={200}
          withAsterisk
          label="Your email"
          placeholder="Your email"
          type="email"
          error={fieldErrors.email}
          required
          value={value.email}
          onChange={(event) => setValue((prev) => ({ ...prev, email: event.target.value }))}
        />
        {/* {error && <h2>{error}</h2>} проверить error это текст или объект в консоли и отобразить  */}
        <TextInput
          w={200}
          withAsterisk
          label="Your name"
          placeholder="Your name"
          error={fieldErrors.name}
          required
          value={value.name}
          onChange={(event) => setValue((prev) => ({ ...prev, name: event.target.value }))}
        />
        <TextInput
          w={200}
          withAsterisk
          label="Your age"
          placeholder="Your age"
          value={value.age}
          error={fieldErrors.age}
          onChange={(event) => setValue((prev) => ({ ...prev, age: event.target.value }))}
        />
        <TextInput
          w={200}
          withAsterisk
          label="Телефон"
          placeholder="+7 (XXX) XXX-XX-XX"
          value={value.phone}
          maxLength={12}
          error={!value.phone.startsWith('+7') ? 'Номер должен начинаться с +7' : undefined}
          onChange={(event) => setValue((prev) => ({ ...prev, phone: event.target.value }))}
        />

        <PasswordInput
          w={200}
          withAsterisk
          label="Your password"
          placeholder="Your password"
          required
          value={value.password}
          error={fieldErrors.password}
          onChange={(event) => setValue((prev) => ({ ...prev, password: event.target.value }))}
        />
        <Checkbox
          style={{ margin: '10px', marginLeft: '2px' }}
          label="is admin?"
          checked={value.role}
          onChange={() => setValue((prev) => ({ ...prev, role: !value.role }))}
        />

        <Button type="submit">Зарегистрироваться</Button>
        <Button style={{ margin: '10px' }} onClick={() => nav('/login')}>
          Есть аккаунт
        </Button>
      </form>
    </div>
  );
};

export default Registration;
