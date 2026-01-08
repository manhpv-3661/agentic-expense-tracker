import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async getSummary(userId: string, startDate?: string, endDate?: string) {
    const query = this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId });

    if (startDate && endDate) {
      query.andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const transactions = await query.getMany();

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netBalance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      netBalance,
      transactionCount: transactions.length,
    };
  }

  async getTrends(
    userId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'monthly',
  ) {
    let dateFormat: string;

    switch (period) {
      case 'daily':
        dateFormat = 'YYYY-MM-DD';
        break;
      case 'weekly':
        dateFormat = 'YYYY-"W"WW';
        break;
      case 'monthly':
      default:
        dateFormat = 'YYYY-MM';
        break;
    }

    const trends = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select(`TO_CHAR(transaction.date, '${dateFormat}')`, 'period')
      .addSelect('transaction.type', 'type')
      .addSelect('SUM(transaction.amount)', 'total')
      .where('transaction.userId = :userId', { userId })
      .groupBy('period')
      .addGroupBy('transaction.type')
      .orderBy('period', 'ASC')
      .getRawMany();

    return trends;
  }

  async getCategoryBreakdown(
    userId: string,
    type?: 'income' | 'expense',
    startDate?: string,
    endDate?: string,
  ) {
    const query = this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('category.color', 'color')
      .addSelect('category.icon', 'icon')
      .addSelect('SUM(transaction.amount)', 'total')
      .addSelect('COUNT(transaction.id)', 'count')
      .where('transaction.userId = :userId', { userId });

    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    if (startDate && endDate) {
      query.andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const breakdown = await query
      .groupBy('category.id')
      .addGroupBy('category.name')
      .addGroupBy('category.color')
      .addGroupBy('category.icon')
      .orderBy('total', 'DESC')
      .getRawMany();

    return breakdown;
  }
}
