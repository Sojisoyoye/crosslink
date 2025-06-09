import axios from "axios";

const API_URL = "http://localhost:3000/api";

export class SignUpUserDto {
  name!: string;
  email!: string;
  password!: string;
}

export class LoginDto {
  email!: string;
  password!: string;
}

export const signUp = async (data: SignUpUserDto) => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};

export const login = async (data: LoginDto) => {
  const response = await axios.post(`${API_URL}/auth/login`, data);

  if (response.data && response.data.accessToken) {
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};
