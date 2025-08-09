import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalSites,
      approvedSites,
      pendingSites,
      rejectedSites,
      totalSubmissions,
      pendingSubmissions,
      approvedSubmissions,
      rejectedSubmissions,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.site.count(),
      this.prisma.site.count({ where: { status: 'APPROVED' } }),
      this.prisma.site.count({ where: { status: 'PENDING' } }),
      this.prisma.site.count({ where: { status: 'REJECTED' } }),
      this.prisma.submission.count(),
      this.prisma.submission.count({ where: { status: 'PENDING' } }),
      this.prisma.submission.count({ where: { status: 'APPROVED' } }),
      this.prisma.submission.count({ where: { status: 'REJECTED' } }),
    ]);

    return {
      users: {
        total: totalUsers,
      },
      sites: {
        total: totalSites,
        approved: approvedSites,
        pending: pendingSites,
        rejected: rejectedSites,
      },
      submissions: {
        total: totalSubmissions,
        pending: pendingSubmissions,
        approved: approvedSubmissions,
        rejected: rejectedSubmissions,
      },
    };
  }

  async getRecentActivity() {
    const [recentSites, recentSubmissions] = await Promise.all([
      this.prisma.site.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.submission.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
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
      }),
    ]);

    return {
      recentSites,
      recentSubmissions,
    };
  }
}
