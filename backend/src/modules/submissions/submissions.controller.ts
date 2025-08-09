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
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, SubmissionStatus } from '@prisma/client';
import { ApiResponse as CustomApiResponse } from '../../common/interfaces/api-response.interface';

@ApiTags('Submissions')
@Controller('submissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new site for approval (User)' })
  @ApiResponse({ status: 201, description: 'Submission created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @Request() req,
  ): Promise<CustomApiResponse> {
    const submission = await this.submissionsService.create(
      createSubmissionDto,
      req.user.id,
    );

    return {
      success: true,
      message: 'Submission created successfully',
      data: submission,
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get all submissions with optional status filter (Admin only)',
  })
  @ApiQuery({ name: 'status', enum: SubmissionStatus, required: false })
  @ApiResponse({
    status: 200,
    description: 'Submissions retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @Query('status') status?: SubmissionStatus,
  ): Promise<CustomApiResponse> {
    const submissions = await this.submissionsService.findAll(status);

    return {
      success: true,
      message: 'Submissions retrieved successfully',
      data: submissions,
    };
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get pending submissions (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Pending submissions retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findPending(): Promise<CustomApiResponse> {
    const submissions = await this.submissionsService.findPending();

    return {
      success: true,
      message: 'Pending submissions retrieved successfully',
      data: submissions,
    };
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user submissions' })
  @ApiResponse({
    status: 200,
    description: 'User submissions retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findMySubmissions(@Request() req): Promise<CustomApiResponse> {
    const submissions = await this.submissionsService.findByUser(req.user.id);

    return {
      success: true,
      message: 'User submissions retrieved successfully',
      data: submissions,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get submission by ID' })
  @ApiResponse({
    status: 200,
    description: 'Submission retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomApiResponse> {
    const submission = await this.submissionsService.findOne(id);

    return {
      success: true,
      message: 'Submission retrieved successfully',
      data: submission,
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Review submission (Admin only)' })
  @ApiResponse({ status: 200, description: 'Submission reviewed successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async review(
    @Param('id', ParseIntPipe) id: number,
    @Body() reviewSubmissionDto: ReviewSubmissionDto,
    @Request() req,
  ): Promise<CustomApiResponse> {
    const submission = await this.submissionsService.review(
      id,
      reviewSubmissionDto,
      req.user.id,
    );

    return {
      success: true,
      message: 'Submission reviewed successfully',
      data: submission,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete submission (Owner or Admin)' })
  @ApiResponse({ status: 200, description: 'Submission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<CustomApiResponse> {
    await this.submissionsService.remove(id, req.user.id, req.user.role);

    return {
      success: true,
      message: 'Submission deleted successfully',
    };
  }
}
