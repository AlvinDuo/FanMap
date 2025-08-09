import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { SiteStatus } from '@prisma/client';

export class UpdateSiteStatusDto {
  @ApiProperty({ enum: SiteStatus, example: SiteStatus.APPROVED })
  @IsEnum(SiteStatus)
  @IsNotEmpty()
  status: SiteStatus;
}
