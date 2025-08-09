import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateSiteDto {
  @ApiProperty({ example: 'Beautiful Mountain View' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'A stunning mountain view with hiking trails' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: {
      type: 'Point',
      coordinates: [121.5654, 25.033],
    },
    description: 'GeoJSON Point format',
  })
  @IsObject()
  @IsNotEmpty()
  location: object;
}
