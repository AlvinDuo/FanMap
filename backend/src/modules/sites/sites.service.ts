import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site, SiteStatus, Prisma } from '@prisma/client';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  async create(createSiteDto: CreateSiteDto, userId: number): Promise<Site> {
    return this.prisma.site.create({
      data: {
        ...createSiteDto,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll(status?: SiteStatus): Promise<Site[]> {
    const where: Prisma.SiteWhereInput = status ? { status } : {};

    return this.prisma.site.findMany({
      where,
      include: {
        createdBy: {
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

  async findApproved(): Promise<Site[]> {
    return this.findAll(SiteStatus.APPROVED);
  }

  async findOne(id: number): Promise<Site> {
    const site = await this.prisma.site.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    return site;
  }

  async update(
    id: number,
    updateSiteDto: UpdateSiteDto,
    userId: number,
    userRole: string,
  ): Promise<Site> {
    const site = await this.findOne(id);

    // Only admin or the creator can update
    if (userRole !== 'ADMIN' && site.createdById !== userId) {
      throw new ForbiddenException('You can only update your own sites');
    }

    try {
      return await this.prisma.site.update({
        where: { id },
        data: updateSiteDto,
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Site with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async updateStatus(id: number, status: SiteStatus): Promise<Site> {
    try {
      return await this.prisma.site.update({
        where: { id },
        data: { status },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Site with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: number, userId: number, userRole: string): Promise<void> {
    const site = await this.findOne(id);

    // Only admin or the creator can delete
    if (userRole !== 'ADMIN' && site.createdById !== userId) {
      throw new ForbiddenException('You can only delete your own sites');
    }

    try {
      await this.prisma.site.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Site with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}
