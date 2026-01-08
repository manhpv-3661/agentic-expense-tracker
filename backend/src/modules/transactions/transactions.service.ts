import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
  Like,
} from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      userId,
    });
    return this.transactionsRepository.save(transaction);
  }

  async findAll(userId: string, filters: FilterTransactionDto) {
    const {
      type,
      categoryId,
      startDate,
      endDate,
      search,
      page = '1',
      limit = '20',
    } = filters;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId });

    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    if (categoryId) {
      query.andWhere('transaction.categoryId = :categoryId', { categoryId });
    }

    if (startDate && endDate) {
      query.andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      query.andWhere('transaction.date >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('transaction.date <= :endDate', { endDate });
    }

    if (search) {
      query.andWhere('transaction.description ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .orderBy('transaction.date', 'DESC')
      .skip(skip)
      .take(limitNum)
      .getManyAndCount();

    return {
      data,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(
    id: string,
    userId: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);
    Object.assign(transaction, updateTransactionDto);
    return this.transactionsRepository.save(transaction);
  }

  async remove(id: string, userId: string): Promise<void> {
    const transaction = await this.findOne(id, userId);
    await this.transactionsRepository.remove(transaction);
  }

  async exportToCsv(
    userId: string,
    filters: FilterTransactionDto,
  ): Promise<string> {
    const { data } = await this.findAll(userId, { ...filters, limit: '10000' });

    // CSV header
    let csv = 'Date,Type,Category,Amount,Description\n';

    // CSV rows
    data.forEach((transaction) => {
      const row = [
        transaction.date,
        transaction.type,
        transaction.category.name,
        transaction.amount,
        `"${transaction.description || ''}"`,
      ].join(',');
      csv += row + '\n';
    });

    return csv;
  }
}
