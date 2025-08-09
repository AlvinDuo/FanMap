import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { UpdateSiteStatusDto } from './dto/update-site-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, SiteStatus } from '@prisma/client';
import { ApiResponse as CustomApiResponse } from '../../common/interfaces/api-response.interface';

@ApiTags('Sites')
@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new site (User)' })
  @ApiResponse({ status: 201, description: 'Site created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createSiteDto: CreateSiteDto,
    @Request() req,
  ): Promise<CustomApiResponse> {
    const site = await this.sitesService.create(createSiteDto, req.user.id);

    return {
      success: true,
      message: 'Site created successfully',
      data: site,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all approved sites (Public)' })
  @ApiResponse({ status: 200, description: 'Sites retrieved successfully' })
  async findAll(): Promise<CustomApiResponse> {
    const sites = await this.sitesService.findApproved();

    return {
      success: true,
      message: 'Sites retrieved successfully',
      data: sites,
    };
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all sites with optional status filter (Admin only)',
  })
  @ApiQuery({ name: 'status', enum: SiteStatus, required: false })
  @ApiResponse({ status: 200, description: 'Sites retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAllWithStatus(
    @Query('status') status?: SiteStatus,
  ): Promise<CustomApiResponse> {
    const sites = await this.sitesService.findAll(status);

    return {
      success: true,
      message: 'Sites retrieved successfully',
      data: sites,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get site by ID' })
  @ApiResponse({ status: 200, description: 'Site retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomApiResponse> {
    const site = await this.sitesService.findOne(id);

    return {
      success: true,
      message: 'Site retrieved successfully',
      data: site,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update site (Owner or Admin)' })
  @ApiResponse({ status: 200, description: 'Site updated successfully' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSiteDto: UpdateSiteDto,
    @Request() req,
  ): Promise<CustomApiResponse> {
    const site = await this.sitesService.update(
      id,
      updateSiteDto,
      req.user.id,
      req.user.role,
    );

    return {
      success: true,
      message: 'Site updated successfully',
      data: site,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update site status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Site status updated successfully' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSiteStatusDto: UpdateSiteStatusDto,
  ): Promise<CustomApiResponse> {
    const site = await this.sitesService.updateStatus(
      id,
      updateSiteStatusDto.status,
    );

    return {
      success: true,
      message: 'Site status updated successfully',
      data: site,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete site (Owner or Admin)' })
  @ApiResponse({ status: 200, description: 'Site deleted successfully' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<CustomApiResponse> {
    await this.sitesService.remove(id, req.user.id, req.user.role);

    return {
      success: true,
      message: 'Site deleted successfully',
    };
  }
}
