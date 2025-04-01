import axios from "axios";

const API_URL = "https://localhost:3001/api";

export class SignUpUserDto {
  name!: string;
  email!: string;
  password!: string;
}

export const signUp = async (data: SignUpUserDto) => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};
