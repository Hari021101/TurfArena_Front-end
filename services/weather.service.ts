import { apiFetch } from './api';

export interface WeatherData {
  temp: number;
  condition: string;
  description: string;
  icon: string;
}

export const getTurfWeather = async (turfId: string): Promise<WeatherData | null> => {
  try {
    const data = await apiFetch(`/weather/${turfId}`);
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};
