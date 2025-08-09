import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import type { ApiResponse as CustomApiResponse } from './common/interfaces/api-response.interface';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHello(): CustomApiResponse {
    return {
      success: true,
      message: this.appService.getHello(),
      data: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      },
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth(): CustomApiResponse {
    return {
      success: true,
      message: 'Service is healthy',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
