import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(
    @CurrentUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getSummary(user.id, startDate, endDate);
  }

  @Get('trends')
  getTrends(
    @CurrentUser() user: User,
    @Query('period') period?: 'daily' | 'weekly' | 'monthly',
  ) {
    return this.dashboardService.getTrends(user.id, period);
  }

  @Get('category-breakdown')
  getCategoryBreakdown(
    @CurrentUser() user: User,
    @Query('type') type?: 'income' | 'expense',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getCategoryBreakdown(
      user.id,
      type,
      startDate,
      endDate,
    );
  }
}
