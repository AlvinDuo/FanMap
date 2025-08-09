import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { Submission, SubmissionStatus, Prisma } from '@prisma/client';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createSubmissionDto: CreateSubmissionDto,
    userId: number,
  ): Promise<Submission> {
    return this.prisma.submission.create({
      data: {
        siteData: createSubmissionDto.siteData,
        submittedById: userId,
      },
      include: {
        submittedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll(status?: SubmissionStatus): Promise<Submission[]> {
    const where: Prisma.SubmissionWhereInput = status ? { status } : {};

    return this.prisma.submission.findMany({
      where,
      include: {
        submittedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findPending(): Promise<Submission[]> {
    return this.findAll('PENDING');
  }

  async findByUser(userId: number): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: { submittedById: userId },
      include: {
        submittedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<Submission> {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        submittedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    return submission;
  }

  async review(
    id: number,
    reviewSubmissionDto: ReviewSubmissionDto,
    reviewerId: number,
  ): Promise<Submission> {
    const submission = await this.findOne(id);

    if (submission.status !== 'PENDING') {
      throw new ForbiddenException('Only pending submissions can be reviewed');
    }

    try {
      const updatedSubmission = await this.prisma.submission.update({
        where: { id },
        data: {
          status: reviewSubmissionDto.status,
          reviewedById: reviewerId,
          reviewedAt: new Date(),
        },
        include: {
          submittedBy: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      // If approved, create the actual site
      if (reviewSubmissionDto.status === 'APPROVED') {
        const siteData = submission.siteData as any;
        await this.prisma.site.create({
          data: {
            name: siteData.name,
            description: siteData.description,
            location: siteData.location,
            status: 'APPROVED',
            createdById: submission.submittedById,
          },
        });
      }

      return updatedSubmission;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Submission with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: number, userId: number, userRole: string): Promise<void> {
    const submission = await this.findOne(id);

    // Only admin or the submitter can delete
    if (userRole !== 'ADMIN' && submission.submittedById !== userId) {
      throw new ForbiddenException('You can only delete your own submissions');
    }

    try {
      await this.prisma.submission.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Submission with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}
