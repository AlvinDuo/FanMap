import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiResponse as CustomApiResponse } from '../../common/interfaces/api-response.interface';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStats(): Promise<CustomApiResponse> {
    const stats = await this.dashboardService.getStats();

    return {
      success: true,
      message: 'Statistics retrieved successfully',
      data: stats,
    };
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get recent activity (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Recent activity retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getRecentActivity(): Promise<CustomApiResponse> {
    const activity = await this.dashboardService.getRecentActivity();

    return {
      success: true,
      message: 'Recent activity retrieved successfully',
      data: activity,
    };
  }
}
