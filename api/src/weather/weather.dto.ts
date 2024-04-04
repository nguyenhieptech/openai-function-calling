import { PartialType } from '@nestjs/swagger';

export class CreateWeatherDto {}

export class UpdateWeatherDto extends PartialType(CreateWeatherDto) {}
