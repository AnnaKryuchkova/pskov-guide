import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Header } from '../components/Header/Header';
import Main from '../components/Main/Main';
import { Footer } from '../components/Footer/Footer';
import Registration from '../components/registration/Reg';
import Login from '../components/Login/Login';
import Profile from '../components/Profile/Profile';
import Categories from '../components/Categories/Categories';
import { Flex } from '@mantine/core';
import Likes from '../components/Likes/Likes';
import { Notifications } from '@mantine/notifications';
import Moderation from '../components/Moderation/Moderation';
function App() {
  // добавить саспенс для отображения лоадера.//....
  return (
    <BrowserRouter>
      <Flex direction="column" style={{ minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/categories" element={<Categories />} />
            {/* <Route path="/categories/:id/places" element={<CategoryPlaces />} /> */}
            {/* <Route path="/places/:id" element={<PlaceInfo />} /> */}
            {/* <Route path="/places/:id/book" element={<BookingForm />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/reg" element={<Registration />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/moderation" element={<Moderation />} />
            {/* <Route index element={<ProfileInfo />} /> */}
            {/* <Route path="bookings" element={<UserBookings />} /> */}
            <Route path="likes" element={<Likes />} />
            {/* </Route> */}
          </Routes>
        </div>
        <Footer />
      </Flex>
    </BrowserRouter>
  );
}

export default App;
