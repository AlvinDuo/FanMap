import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({
    example: {
      name: 'Beautiful Mountain View',
      description: 'A stunning mountain view with hiking trails',
      location: {
        type: 'Point',
        coordinates: [121.5654, 25.033],
      },
    },
    description: 'Site data for the submission',
  })
  @IsObject()
  @IsNotEmpty()
  siteData: object;
}
