import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private readonly apiKey = 'TU_API_KEY_DE_OPENWEATHERMAP'; // regístrate para obtener una gratuita
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  async obtenerPronostico(ciudad: string) {
    try {
      const res = await axios.get(this.baseUrl, {
        params: {
          q: ciudad,
          appid: this.apiKey,
          units: 'metric',
          lang: 'es',
        },
      });
      const data = res.data;
      return {
        temp: data.main.temp,
        lluvia_prob: data.rain?.['1h'] ? 80 : (data.weather[0].description.includes('lluvia') ? 70 : 10),
        condicion: data.weather[0].description,
      };
    } catch (error) {
      return null;
    }
  }
}