import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum SubmissionStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ReviewSubmissionDto {
  @ApiProperty({
    enum: SubmissionStatus,
    example: SubmissionStatus.APPROVED,
  })
  @IsEnum(SubmissionStatus)
  @IsNotEmpty()
  status: SubmissionStatus;
}
