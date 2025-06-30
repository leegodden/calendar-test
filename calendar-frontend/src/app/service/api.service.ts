import axios, { AxiosInstance } from 'axios';

export abstract class ApiService {
  protected _axios: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3344',
  });
}
