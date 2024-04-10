export interface ChildProps {
  children: JSX.Element[] | JSX.Element;
  // allowedRoles: string[];
}
export interface userProps {
  _id: string;
  id: string;
  gender: string;
  fullname: string;
  email: string;
  role?: string;
  token: string;
  photo?: string;
  user: any[];
}

export interface IDecodedUser {
  email: string;
  exp: number;
  iat: number;
  jti?: string;
  phone: string;
  role: string;
  token_type?: string;
  _id: string;
  fullname?: string;
}

export interface IUser {
  role: string;
  loginAttempts?: any[];
  _id: string;
  fullname: string;
  email: string;
  createdAt: string;
  __v: number;
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface LayoutProps {
  children: JSX.Element[] | JSX.Element;
  Heading: string;
  Background: string;
}

export interface AdminLayoutProps {
  children: JSX.Element[] | JSX.Element;
  pageTitle: string;
  // Heading: string;
  // Background: string;
}

export interface ICommodity {
  id: string | null | undefined;
  image?: string[];
  price: number;
  _id: string;
  previous_price: number;
  current_price: number;
  name: string;
  analysis: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface IWeather {
  coord: Coord;
  weather?: WeatherEntity[] | null;
  base: string;
  main: Main;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  id: number;
  name: string;
  cod: number;
}
export interface Coord {
  lon: number;
  lat: number;
}
export interface WeatherEntity {
  id: number;
  main: string;
  description: string;
  icon: string;
}
export interface Main {
  temp: number;
  pressure: number;
  humidity: number;
  temp_min: number;
  temp_max: number;
}
export interface Wind {
  speed: number;
  deg: number;
}
export interface Clouds {
  all: number;
}
export interface Sys {
  type: number;
  id: number;
  message: number;
  country: string;
  sunrise: number;
  sunset: number;
}

