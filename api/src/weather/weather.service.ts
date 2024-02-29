import { Injectable } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';

@Injectable()
export class WeatherService {
  create(createWeatherDto: CreateWeatherDto) {
    return 'This action adds a new weather';
  }

  // Example dummy function hard coded to return the same weather
  // In production, this could be your backend API or an external API
  //! Should return a string/JSON using JSON.stringify()
  findAll(location: string = 'unknown', unit = 'fahrenheit'): string {
    if (location.toLowerCase().includes('tokyo')) {
      return JSON.stringify({ location: 'Tokyo', temperature: '15', unit: 'celsius' });
    } else if (location.toLowerCase().includes('san francisco')) {
      return JSON.stringify({
        location: 'San Francisco',
        temperature: '72',
        unit: 'fahrenheit',
      });
    } else if (location.toLowerCase().includes('paris')) {
      return JSON.stringify({ location: 'Paris', temperature: '22', unit: 'fahrenheit' });
    } else {
      return JSON.stringify({ location, temperature: 'unknown' });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} weather`;
  }

  update(id: number, updateWeatherDto: UpdateWeatherDto) {
    return `This action updates a #${id} weather`;
  }

  remove(id: number) {
    return `This action removes a #${id} weather`;
  }
}
