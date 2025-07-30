// types.ts

export interface RegistrationApiProps {
  name: string;
  email: string;
  password: string;
  age: string;
  phone: string;
  role: string;
}

export interface RegistrationResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  // Пароль не должен возвращаться в ответе!
}

export interface LoginApiProps {
  email: string;
  password: string;
}

export interface LoginApiResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  // Пароль не должен возвращаться в ответе!
}

export interface LogoutApiResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  // Пароль не должен возвращаться в ответе!
}
export interface UserProps {
  guestId?: string; // Параметр для запроса, если нужен
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

// Типы для категорий
export interface CategoryItem {
  id: number;
  name: string;
  icon?: string;
  description?: string;
}

export interface CategoryProps {
  // Параметры запроса (например, для фильтрации)
  search?: string;
  page?: number;
  limit?: number;
}

export interface CategoryResponse extends Array<CategoryItem> {} // Массив категорий

// Типы для мест
export interface PlaceItem {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  workingHours: string;
  maxBooking: number;
}

export interface PlaceProps {
  // Параметры запроса (например, для фильтрации)
  search?: string;
  page?: number;
  limit?: number;
}

export interface PlaceResponse {
  Likes: any;
  Photos: any[];
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  workingHours: string;
  placeType: string;
  isBooking: boolean;
  maxBooking: number;
}

// Дополнительно: тип для пагинированного ответа
export interface PaginatedPlaceResponse {
  total: number;
  page: number;
  pages: number;
  places: PlaceItem[];
}
export interface UserLike {
  id: number;
  place: {
    description: any;
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: {
      id: number;
      name: string;
      icon?: string;
    };
    mainPhoto?: string;
    workingHours: string;
  };
  createdAt: string;
}

//нот плэйс
export interface NotPlaceProps {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  workingHours?: string;
  placeType?: string;
  isBooking?: boolean;
  maxBooking?: string;
  categoryId: number;
  photos?: string[];
}

export interface NotPlaceResponse {
  id: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  workingHours?: string;
  placeType?: string;
  isBooking: boolean;
  maxBooking: number;
  categoryId: number;
  Photos: PhotoResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PhotoResponse {
  id: number;
  url: string;
  isMain: boolean;
  placeId?: number;
  notPlaceId?: number;
}

export interface ApproveNotPlaceResponse {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  workingHours: string;
  maxBooking: number;
}

export interface RejectNotPlaceResponse {
  message: string;
}
export interface UserLikesResponse extends Array<UserLike> {}

export interface EditPlaceProps {
  id: number | undefined;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  workingHours: string;
  maxBooking: number;
  isBooking: boolean;
}
